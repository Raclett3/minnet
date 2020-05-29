import Router from '@koa/router';
import Koa from 'koa';
import { getRepository } from 'typeorm';

import { configCache } from '../config';
import { Note } from '../entities/note';
import { User } from '../entities/user';
import { appendContext, renderLocalPerson, renderNote } from '../helpers/activitypub/renderer';
import { renderURI } from '../helpers/render-uri';

const router = new Router();

router.get('/users/:user', async ctx => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const user = await getRepository(User).findOne({ username: ctx.params.user });

  if (!user) {
    ctx.status = 404;
    ctx.body = {};
    return;
  }

  ctx.body = appendContext(renderLocalPerson(user.username, user.account.name, user.publicKey));
});

router.get('/keypair/:user', async ctx => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const user = await getRepository(User).findOne({ username: ctx.params.user });

  if (!user) {
    ctx.status = 404;
    ctx.body = {};
    return;
  }

  ctx.body = appendContext(renderLocalPerson(user.username, user.account.name, user.publicKey).publicKey);
});

router.get('/notes/:note', async ctx => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const note = await getRepository(Note).findOne({ id: ctx.params.note });

  if (!note) {
    ctx.status = 404;
    ctx.body = {};
    return;
  }

  const inReplyTo = (await note.inReplyTo) || undefined;

  ctx.body = appendContext(
    renderNote(
      note.id,
      note.createdAt,
      note.uri || renderURI('users', note.postedBy.username),
      note.content,
      inReplyTo && inReplyTo.id,
    ),
  );
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
