import * as path from 'path';
import { getRepository } from 'typeorm';

import { loadConfig } from '../../src/config';
import { signIn, signUp } from '../../src/controllers/users';
import { User } from '../../src/entities/user';
import { initPostgres } from '../../src/postgres';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  loadConfig(path.resolve(__dirname, '../resources/config-example.json'));
  await initPostgres();
});

describe('Usersコントローラー', () => {
  test('サインアップ', async () => {
    const repository = getRepository(User);

    const kaho = {
      username: 'kaho',
      account: {
        username: 'kaho',
        host: null,
        name: 'Kaho',
        uri: null,
        inbox: null,
      },
    };

    const natsuha = {
      username: 'natsuha',
      account: {
        username: 'natsuha',
        host: null,
        name: 'Natsuha',
        uri: null,
        inbox: null,
      },
    };

    expect.assertions(4);
    expect(await signUp('kaho', 'Komiya', 'Kaho')).toMatchObject(kaho);
    expect(await signUp('natsuha', 'Arisugawa', 'Natsuha')).toMatchObject(natsuha);
    await expect(signUp('natsuha', 'Arisugawa', 'Natsuha')).rejects.toThrowError();
    expect(await repository.findOne({ username: 'kaho' })).toMatchObject(kaho);
  });

  test('サインイン', async () => {
    expect.assertions(2);
    expect(await signIn('kaho', 'Sonoda')).toBeNull();
    expect(await signIn('kaho', 'Komiya')).not.toBeNull();
  });
});
