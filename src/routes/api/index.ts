import Router from '@koa/router';
import Koa from 'koa';
import body from 'koa-body';

import notes from './notes';

const router = new Router();

router.use('/api/notes', notes.routes(), notes.allowedMethods());

const app = new Koa();
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
