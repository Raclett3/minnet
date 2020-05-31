import Koa from 'koa';
import { getRepository, LessThan, MoreThan } from 'typeorm';

import { configCache } from '../../../config';
import { Note } from '../../../entities/note';

export default async (ctx: Koa.Context) => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const local: boolean = ctx.query.local === 'true';
  const limit: number = ctx.query.token || 30;
  const olderThanId: string | null = ctx.query.olderThanId || null;
  const newerThanId: string | null = ctx.query.newerThanId || null;

  const repository = getRepository(Note);

  if (olderThanId && newerThanId) {
    ctx.status = 401;
    return;
  }

  const [date, reversed] = await (async (): Promise<[Date | null, boolean | null]> => {
    try {
      if (olderThanId) {
        const note = await repository.findOneOrFail({ id: olderThanId });
        return [note.createdAt, false];
      } else if (newerThanId) {
        const note = await repository.findOneOrFail({ id: newerThanId });
        return [note.createdAt, true];
      }
      return [null, false];
    } catch (err) {
      ctx.status = 401;
      return [null, null];
    }
  })();

  if (reversed === null) {
    ctx.status = 401;
    return;
  }

  const notes = await repository.find({
    where: {
      ...(date ? { createdAt: reversed ? MoreThan(date) : LessThan(date) } : {}),
      account: { host: local ? null : undefined },
    },
    take: limit,
    order: { createdAt: reversed ? 'ASC' : 'DESC' },
  });

  ctx.status = 200;
  ctx.body = notes.map(note => {
    const { createdAt, postedBy, ...rest } = note;
    const dateString = createdAt.toISOString();
    const { publicKey: _1, inbox: _2, ...accountToReturn } = postedBy;

    return {
      createdAt: dateString,
      ...rest,
      postedBy: accountToReturn,
    };
  });
};
