import Router from '@koa/router';

import createNote from './create-note';

const router = new Router();

router.post('/', createNote);

export default router;
