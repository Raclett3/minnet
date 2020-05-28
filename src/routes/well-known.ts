import Router from '@koa/router';
import Koa from 'koa';

import { configCache } from '../config';
import { renderURI } from '../helpers/render-uri';

const router = new Router();

router.get('/.well-known/webfinger', ctx => {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  const resource: string = ctx.query.resource;
  if (typeof resource !== 'string') {
    ctx.response.status = 400;
  }
  const acct = resource
    .toLowerCase()
    .split(/:|\//)
    .slice(-1)[0];

  const [username, host] = acct.split('@');

  if (host && host !== configCache.host) {
    ctx.response.status = 404;
    return;
  }

  ctx.body = {
    subject: `acct:${username}@${configCache.host}`,
    links: [
      {
        rel: 'self',
        type: 'application/activity+json',
        href: renderURI('users', username),
      },
    ],
  };

  ctx.status = 200;
});

router.get('/.well-known/nodeinfo', ctx => {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  ctx.body = {
    links: [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
        href: `https://${configCache.host}/nodeinfo/2.0`,
      },
    ],
  };

  ctx.status = 200;
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
