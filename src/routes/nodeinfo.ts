import Router from '@koa/router';
import Koa from 'koa';

const router = new Router();

router.get('/nodeinfo/2.0', async ctx => {
  ctx.body = {
    version: '2.0',
    software: { name: 'minnet', version: '0.0.0' },
    protocols: ['activitypub'],
    openRegistrations: true,
  };
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
