import Router from '@koa/router';

import signUp from './signup';

const router = new Router();

router.post('/', signUp);

export default router;
