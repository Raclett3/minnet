import Koa from 'koa';
import { getRepository } from 'typeorm';

import { configCache } from '../../../config';
import { unfollowAccount } from '../../../controllers/follows';
import { User } from '../../../entities/user';
import { appendContext, renderFollow, renderUndo } from '../../../helpers/activitypub/renderer';
import { verifyJWT } from '../../../helpers/jwt-async';
import { renderURI } from '../../../helpers/render-uri';
import { resolveOrNull } from '../../../helpers/suppressors';
import { deliver } from '../../../remote/deliver';
import { resolveAccount } from '../../../remote/resolver';

export default async (ctx: Koa.Context) => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const token = ctx.request.body.token;
  const target = ctx.request.body.target;

  if (typeof token !== 'string' || typeof target !== 'string') {
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

  const user = await getRepository(User).findOne({ account: { id: accountId } });
  if (!user) {
    ctx.status = 401;
    return;
  }

  const resolved = await resolveAccount(target);

  if (resolved.inbox) {
    const actorURI = renderURI('users', user.username);
    const activity = appendContext(renderUndo(actorURI, renderFollow(actorURI, target)));

    await unfollowAccount(user.account, resolved);
    await resolveOrNull(deliver(user.username, Buffer.from(user.privateKey), resolved.inbox, activity));
  } else {
    await unfollowAccount(user.account, resolved);
  }

  ctx.status = 204;
};
