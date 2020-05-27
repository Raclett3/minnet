import Koa from 'koa';
import { getConnection } from 'typeorm';

import { configCache } from '../../../config';
import { createNote } from '../../../controllers/notes';
import { User } from '../../../entities/user';
import { verifyJWT } from '../../../helpers/jwt-async';

export default async (ctx: Koa.Context) => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const text = ctx.request.body.text;
  const token = ctx.request.body.token;

  if (typeof text !== 'string' || typeof token !== 'string') {
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

  await createNote(
    { id: accountId },
    {
      content: text,
    },
  );

  ctx.status = 204;
};
