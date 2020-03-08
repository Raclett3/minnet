import * as path from 'path';
import request from 'supertest';
import { getConnection } from 'typeorm';

import { loadConfig } from '../../src/config';
import { signUp } from '../../src/controllers/users';
import { User } from '../../src/entities/user';
import { appendContext, renderLocalPerson } from '../../src/helpers/activitypub/renderer';
import { initPostgres } from '../../src/postgres';
import app from '../../src/server';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  loadConfig(path.resolve(__dirname, '../resources/config-example.json'));
  await initPostgres();
});

describe('各種ActivityPubオブジェクトの取得', () => {
  beforeAll(async () => {
    await signUp('Mano', 'Sakuragi', 'Mano');
    await signUp('Meguru', 'Hachimiya', 'Meguru');
    await signUp('Hiori', 'Kazano', 'Hiori');
  });

  const server = request(app.callback());

  test('users', async () => {
    expect.assertions(2);

    const connection = getConnection();
    const repository = connection.getRepository(User);
    const mano = await repository.findOne({ username: 'Mano' });
    if (!mano) {
      throw new Error('Failed to find a user');
    }

    const expected = appendContext(renderLocalPerson('Mano', 'Mano', mano.publicKey));
    expect(JSON.parse((await server.get('/users/Mano')).text)).toMatchObject(expected);
    expect((await server.get('/users/Amai')).status).toBe(404);
  });
});
