import Koa from 'koa';
import { getConnection } from 'typeorm';

import { configCache } from '../../../config';
import { followerInboxes } from '../../../controllers/follows';
import { createNote } from '../../../controllers/notes';
import { User } from '../../../entities/user';
import { appendContext, renderCreate, renderNote } from '../../../helpers/activitypub/renderer';
import { verifyJWT } from '../../../helpers/jwt-async';
import { resolveOrNull } from '../../../helpers/suppressors';
import { deliver } from '../../../remote/deliver';

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
    (inReplyTo !== undefined && typeof inReplyTo !== 'string')
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

  const uri = `https://${configCache.host}/users/${user.username}`;
  const activity = appendContext(renderCreate(uri, renderNote(note.id, note.createdAt, uri, note.content, inReplyTo)));

  if (typeof inReplyTo === 'string') {
    await deliver(user.username, Buffer.from(user.privateKey), inReplyTo, activity);
  }

  const inboxes = await followerInboxes(user.account.id);
  for (const inbox of inboxes) {
    await resolveOrNull(deliver(user.username, Buffer.from(user.privateKey), inbox, activity));
  }

  ctx.status = 204;
};
