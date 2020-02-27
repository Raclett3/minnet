import * as path from 'path';

import { loadConfig } from '../../src/config';
import * as Accounts from '../../src/controllers/accounts';
import { initPostgres } from '../../src/postgres';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  loadConfig(path.resolve(__dirname, '../resources/config-example.json'));
  await initPostgres();
});

describe('Accountsコントローラー', () => {
  test('ローカルアカウントの作成', async () => {
    expect.assertions(4);

    await expect(Accounts.createLocalAccount('Asahi', 'Asahi')).resolves.not.toThrowError();
    await expect(Accounts.createLocalAccount('Fuyuko', 'Fuyuko')).resolves.not.toThrowError();
    await expect(Accounts.createLocalAccount('asahi', 'asahi')).resolves.not.toThrowError();
    await expect(Accounts.createLocalAccount('Asahi', 'Asahi')).rejects.toThrowError();
  });

  test('リモートアカウントの作成', async () => {
    expect.assertions(4);

    await expect(
      Accounts.createRemoteAccount(
        'Asahi',
        'example.com',
        'Asahi',
        'https://example.com/Asahi',
        'https://example.com/inbox',
      ),
    ).resolves.not.toThrowError();
    await expect(
      Accounts.createRemoteAccount(
        'Fuyuko',
        'example.com',
        'Fuyuko',
        'https://example.com/Fuyuko',
        'https://example.com/inbox',
      ),
    ).resolves.not.toThrowError();
    await expect(
      Accounts.createRemoteAccount(
        'asahi',
        'example.com',
        'Asahi',
        'https://example.com/asahi',
        'https://example.com/inbox',
      ),
    ).resolves.not.toThrowError();
    await expect(
      Accounts.createRemoteAccount(
        'Asahi',
        'example.com',
        'Asahi',
        'https://example.com/asahi',
        'https://example.com/inbox',
      ),
    ).rejects.toThrowError();
  });

  test('アカウントの検索', async () => {
    expect.assertions(4);

    expect(await Accounts.findAccount('Asahi')).toMatchObject({
      username: 'Asahi',
      host: null,
      name: 'Asahi',
      uri: null,
      inbox: null,
    });
    expect(await Accounts.findAccount('Asahi', 'example.com')).toMatchObject({
      username: 'Asahi',
      host: 'example.com',
      name: 'Asahi',
      uri: 'https://example.com/Asahi',
      inbox: 'https://example.com/inbox',
    });
    expect(await Accounts.findAccount('fuyuko', 'example.com')).toBeUndefined();
    expect(await Accounts.findAccount('Mei', 'example.com')).toBeUndefined();
  });
});
