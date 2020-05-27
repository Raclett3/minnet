declare module 'koa-json-body' {
  import { Middleware } from 'koa';

  function koaJsonBody(): Middleware;

  export = koaJsonBody;
}
