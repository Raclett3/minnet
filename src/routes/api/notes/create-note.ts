import Koa from 'koa';
import { URL } from 'url';

import { configCache } from '../../../config';
import { deliver } from '../../../remote/deliver';

export default async (ctx: Koa.Context) => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  const inReplyTo = ctx.request.body.in_reply_to;
  const text = ctx.request.body.text;
  const token = ctx.request.body.token;

  if (typeof inReplyTo !== 'string' || typeof text !== 'string' || typeof token !== 'string') {
    ctx.status = 400;
    return;
  }

  if (token !== process.env.TOKEN) {
    ctx.status = 401;
    return;
  }

  const url = new URL(inReplyTo);
  const date = new Date();
  const actor = `https://${configCache.host}/users/asahi`;
  const id = Math.floor(Math.random() * 10000000);

  const document = {
    '@context': 'https://www.w3.org/ns/activitystreams',

    id: `https://${configCache.host}/create/${id}`,
    type: 'Create',
    actor: actor,

    object: {
      id: `https://${configCache.host}/notes/${id}`,
      type: 'Note',
      published: date.toISOString(),
      attributedTo: actor,
      inReplyTo: inReplyTo,
      content: text,
      to: 'https://www.w3.org/ns/activitystreams#Public',
    },
  };

  if (!deliver(actor, `${url.protocol}//${url.host}/inbox`, document)) {
    ctx.status = 500;
  }

  ctx.status = 204;
};
