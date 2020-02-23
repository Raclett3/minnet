import Router from '@koa/router';
import Koa from 'koa';
import mount from 'koa-mount';
import send from 'koa-send';

import api from './api';
import nodeinfo from './nodeinfo';
import objects from './objects';
import wellKnown from './well-known';

const router = new Router();
const sendOptions = { root: process.cwd() + '/build/client/' };

router.get('/', ctx => send(ctx, 'index.html', sendOptions));
router.get('/app.js', ctx => send(ctx, 'app.js', sendOptions));

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(mount(wellKnown));
app.use(mount(api));
app.use(mount(nodeinfo));
app.use(mount(objects));

export default app;
