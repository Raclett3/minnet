import * as path from 'path';

import { loadConfig } from '../../src/config';
import { findUser, signIn, signUp } from '../../src/controllers/users';
import { User } from '../../src/entities/user';
import { initPostgres } from '../../src/postgres';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  loadConfig(path.resolve(__dirname, '../resources/config-example.json'));
  await initPostgres();
});

describe('Usersコントローラー', () => {
  let kaho: User;
  test('サインアップ', async () => {
    expect.assertions(3);

    kaho = await signUp('kaho', 'Komiya', 'Kaho');
    expect(kaho).toBeTruthy();
    expect(await signUp('natsuha', 'Arisugawa', 'Natsuha')).toBeTruthy();
    await expect(signUp('natsuha', 'Arisugawa', 'Natsuha')).rejects.toThrowError();
  });

  test('サインイン', async () => {
    expect.assertions(2);
    expect(await signIn('kaho', 'Sonoda')).toBeNull();
    expect(await signIn('kaho', 'Komiya')).not.toBeNull();
  });

  test('Userの検索', async () => {
    expect.assertions(2);
    expect(await findUser('kaho')).toMatchObject(kaho);
    expect(await findUser('juri')).toBeUndefined();
  });
});
