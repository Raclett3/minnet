import Koa from 'koa';

import { configCache } from '../../../config';
import { ControllerError } from '../../../controllers/error';
import { signUp } from '../../../controllers/users';
import { validatePassword, validateUsername } from '../../../helpers/validators';

export default async (ctx: Koa.Context) => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const username = ctx.request.body.username;
  const plainPassword = ctx.request.body.password;

  if (
    typeof username !== 'string' ||
    typeof plainPassword !== 'string' ||
    !validateUsername(username) ||
    !validatePassword(plainPassword)
  ) {
    ctx.status = 400;
    return;
  }

  try {
    await signUp(username, plainPassword, username);
  } catch (err) {
    if (!(err instanceof ControllerError)) {
      throw err;
    }

    ctx.status = 409;
    return;
  }

  ctx.status = 204;
};
