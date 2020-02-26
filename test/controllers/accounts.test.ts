import * as Accounts from '../../src/controllers/accounts';
import { initPostgres } from '../../src/postgres';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  console.log('Hello');
  await initPostgres();
});

describe('Accountsコントローラー', () => {
  test('ローカルアカウントの作成', async () => {
    expect.assertions(4);

    expect(await Accounts.createLocalAccount('Asahi', 'Asahi')).toBeUndefined();
    expect(await Accounts.createLocalAccount('Fuyuko', 'Fuyuko')).toBeUndefined();
    expect(await Accounts.createLocalAccount('asahi', 'asahi')).toBeUndefined();
    await expect(Accounts.createLocalAccount('Asahi', 'Asahi')).rejects.toThrowError();
  });

  test('リモートアカウントの作成', async () => {
    expect.assertions(4);

    expect(
      await Accounts.createRemoteAccount(
        'Asahi',
        'example.com',
        'Asahi',
        'https://example.com/Asahi',
        'https://example.com/inbox',
      ),
    ).toBeUndefined();
    expect(
      await Accounts.createRemoteAccount(
        'Fuyuko',
        'example.com',
        'Fuyuko',
        'https://example.com/Fuyuko',
        'https://example.com/inbox',
      ),
    ).toBeUndefined();
    expect(
      await Accounts.createRemoteAccount(
        'asahi',
        'example.com',
        'Asahi',
        'https://example.com/asahi',
        'https://example.com/inbox',
      ),
    ).toBeUndefined();
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
