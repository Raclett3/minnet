import fs from 'fs';
import request from 'supertest';

import app from '../src/server';

async function readFile(filename: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data.toString('utf-8'));
    });
  });
}

describe('Server', () => {
  test('Routes', async () => {
    expect.assertions(4);

    const indexHtml = await readFile(process.cwd() + '/build/client/index.html');
    const appJS = await readFile(process.cwd() + '/build/client/app.js');
    const server = request(app.callback());

    expect((await server.get('/')).text).toBe(indexHtml);
    expect((await server.get('/app.js')).text).toBe(appJS);
    expect((await server.get('/404')).status).toBe(404);
    expect((await server.get('/status/404')).status).toBe(404);
  });
});
