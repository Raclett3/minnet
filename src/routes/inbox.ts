import Router from '@koa/router';
import httpSignature from 'http-signature';
import Koa from 'koa';
import json from 'koa-json-body';

import { inbox } from '../remote/activitypub/inbox';

const router = new Router();

router.post('/inbox', json(), async ctx => {
  const parsed = httpSignature.parseRequest(ctx.req);
  await inbox(ctx.request.body, parsed);
  console.log(ctx.request.body);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
