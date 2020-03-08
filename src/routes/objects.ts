import Router from '@koa/router';
import Koa from 'koa';
import { getRepository } from 'typeorm';

import { configCache } from '../config';
import { User } from '../entities/user';
import { appendContext, renderLocalPerson } from '../helpers/activitypub/renderer';

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

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
