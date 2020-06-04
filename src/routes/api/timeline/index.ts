import Router from '@koa/router';

import getTimeline from './get-timeline';

const router = new Router();

router.get('/', getTimeline);

export default router;
