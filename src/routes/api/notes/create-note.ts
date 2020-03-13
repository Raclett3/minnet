import Koa from 'koa';
import { getConnection } from 'typeorm';

import { configCache } from '../../../config';
import { Account } from '../../../entities/account';
import { Note } from '../../../entities/note';
import { generateId } from '../../../helpers/generate-id';
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
  const account = await entityManager.findOne(Account, { id: accountId });
  if (!account) {
    ctx.status = 401;
    return;
  }

  const note = new Note(generateId(), new Date(), null, text, account, null);
  entityManager.save(note);

  ctx.status = 204;
};
