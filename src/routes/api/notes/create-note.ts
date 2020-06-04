import Koa from 'koa';
import { getConnection } from 'typeorm';

import { configCache } from '../../../config';
import { followerInboxes } from '../../../controllers/follows';
import { createNote } from '../../../controllers/notes';
import { User } from '../../../entities/user';
import { appendContext, renderCreate, renderNote } from '../../../helpers/activitypub/renderer';
import { convertToHTML } from '../../../helpers/convert-to-html';
import { verifyJWT } from '../../../helpers/jwt-async';
import { renderURI } from '../../../helpers/render-uri';
import { resolveOrNull } from '../../../helpers/suppressors';
import { deliver } from '../../../remote/deliver';
import { resolveNote } from '../../../remote/resolver';

export default async (ctx: Koa.Context) => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const text = ctx.request.body.text;
  const token = ctx.request.body.token;
  const inReplyTo = ctx.request.body.inReplyTo;

  if (
    typeof text !== 'string' ||
    typeof token !== 'string' ||
    (inReplyTo !== undefined && typeof inReplyTo !== 'string') ||
    text.trim() === ''
  ) {
    ctx.status = 400;
    return;
  }

  let accountId: string;
  try {
    accountId = await verifyJWT(token);
  } catch (err) {
    ctx.status = 401;
    return;
  }

  const entityManager = getConnection().createEntityManager();
  const user = await entityManager.findOne(User, { account: { id: accountId } });
  if (!user) {
    ctx.status = 401;
    return;
  }

  const note = await createNote(
    { id: accountId },
    {
      content: text,
    },
  );

  const uri = renderURI('users', user.username);
  const content = convertToHTML(note.content);
  const activity = appendContext(renderCreate(uri, renderNote(note.id, note.createdAt, uri, content, inReplyTo)));

  const inboxes = await followerInboxes(user.account.id);

  if (typeof inReplyTo === 'string') {
    const noteToReply = await resolveNote(inReplyTo);
    if (noteToReply.postedBy.inbox) {
      inboxes.add(noteToReply.postedBy.inbox);
    }
  }

  for (const inbox of inboxes) {
    await resolveOrNull(deliver(user.username, Buffer.from(user.privateKey), inbox, activity));
  }

  ctx.status = 204;
};
