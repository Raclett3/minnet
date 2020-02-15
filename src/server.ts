import Koa from 'koa';

const app = new Koa();
app.use(ctx => {
  ctx.response.body = '404 Not found';
  ctx.response.status = 404;
});

export default app;
