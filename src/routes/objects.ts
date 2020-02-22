import Router from '@koa/router';
import Koa from 'koa';

import { configCache } from '../config';
import { readFile } from '../helpers/async-fs';

const router = new Router();

router.get('/users/:user', async ctx => {
  if (!configCache) {
    ctx.status = 500;
    return;
  }

  ctx.body = {
    '@context': ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],

    id: `https://${configCache.host}/users/asahi`,
    type: 'Person',
    preferredUsername: 'asahi',
    name: 'Asahi the Super Dry',
    inbox: `https://${configCache.host}/inbox`,

    publicKey: {
      id: `https://${configCache.host}/users/asahi#main-key`,
      owner: `https://${configCache.host}/users/asahi`,
      publicKeyPem: await readFile(process.cwd() + '/public.pem'),
    },
  };
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
