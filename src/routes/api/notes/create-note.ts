import axios from 'axios';
import { createHash } from 'crypto';
import Koa from 'koa';
import RSA from 'node-rsa';
import { URL } from 'url';

import { configCache } from '../../../config';
import { readFile } from '../../../helpers/async-fs';

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

  const rsa = new RSA(Buffer.from(await readFile(process.cwd() + '/private.pem')));
  const dateUTC = date.toUTCString();
  const digest = createHash('sha256')
    .update(JSON.stringify(document))
    .digest('base64');
  const signedString = `date: ${dateUTC}\ndigest: SHA-256=${digest}`;
  const signature = rsa.sign(signedString).toString('base64');

  try {
    await axios.post(`${url.protocol}//${url.host}/inbox`, document, {
      headers: {
        Host: url.host,
        Date: dateUTC,
        Digest: `SHA-256=${digest}`,
        Signature: `keyId="${actor}",headers="date digest",signature="${signature}",algorithm="rsa-sha256"`,
      },
    });
    ctx.status = 204;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    throw err;
  }
};
