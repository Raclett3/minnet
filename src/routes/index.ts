import Router from '@koa/router';
import Koa from 'koa';
import send from 'koa-send';

const router = new Router();
const sendOptions = { root: process.cwd() + '/build/client/' };

router.get('/', ctx => send(ctx, 'index.html', sendOptions));
router.get('/app.js', ctx => send(ctx, 'app.js', sendOptions));

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
