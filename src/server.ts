import Koa from 'koa';
import mount from 'koa-mount';

import routes from './routes';

const app = new Koa();
app.use(mount(routes));
app.use(ctx => {
  ctx.response.body = '404 Not found';
  ctx.response.status = 404;
});

export default app;
