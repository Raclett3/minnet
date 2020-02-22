import * as Path from 'path';
import request from 'supertest';

import { loadConfig } from '../../src/config';
import app from '../../src/server';

describe('.well-known', () => {
  beforeAll(() => {
    loadConfig(Path.resolve(__dirname, '../resources/config-example.json'));
  });

  const server = request(app.callback());

  test('webfinger', async () => {
    expect.assertions(1);

    const expected = {
      subject: 'acct:asahi@example.com',
      links: [
        {
          rel: 'self',
          type: 'application/activity+json',
          href: 'https://example.com/users/asahi',
        },
      ],
    };
    const actual = await server.get('/.well-known/webfinger?resource=acct:asahi@example.com');

    expect(JSON.parse(actual.text)).toMatchObject(expected);
  });
});
