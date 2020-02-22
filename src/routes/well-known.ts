import Router from '@koa/router';
import Koa from 'koa';

import { configCache } from '../config';

const router = new Router();

router.get('/.well-known/webfinger', ctx => {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  const username = 'asahi';

  ctx.body = {
    subject: `acct:${username}@${configCache.host}`,
    links: [
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://${configCache.host}/users/${username}`,
      },
    ],
  };

  ctx.status = 200;
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
