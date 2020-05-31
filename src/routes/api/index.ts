import Router from '@koa/router';
import Koa from 'koa';
import body from 'koa-body';

import follow from './follow';
import notes from './notes';
import timeline from './timeline';
import users from './users';

const router = new Router();

router.use('/api/follow', follow.routes(), follow.allowedMethods());
router.use('/api/notes', notes.routes(), notes.allowedMethods());
router.use('/api/timeline', timeline.routes(), timeline.allowedMethods());
router.use('/api/users', users.routes(), users.allowedMethods());

const app = new Koa();
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
