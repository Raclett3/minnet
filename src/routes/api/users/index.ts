import Router from '@koa/router';

import signIn from './signin';
import signUp from './signup';

const router = new Router();

router.post('/', signUp);
router.post('/signin', signIn);

export default router;
