import Router from '@koa/router';

import createRequest from './create-request';
import deleteFollow from './delete-follow';

const router = new Router();

router.post('/', createRequest);
router.post('/request', createRequest);
router.post('/unfollow', deleteFollow);

export default router;
