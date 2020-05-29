import Koa from 'koa';

import { configCache } from '../../../config';
import { signIn } from '../../../controllers/users';
import { signJWT } from '../../../helpers/jwt-async';

export default async (ctx: Koa.Context) => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const username = ctx.request.body.username;
  const plainPassword = ctx.request.body.password;

  if (typeof username !== 'string' || typeof plainPassword !== 'string') {
    ctx.status = 400;
    return;
  }

  const accountId = await signIn(username, plainPassword);
  if (!accountId) {
    ctx.status = 401;
    return;
  }

  ctx.status = 200;
  ctx.body = await signJWT(accountId);
};
