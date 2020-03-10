import { getRepository } from 'typeorm';

import { loadConfig } from '../src/config';
import * as Accounts from '../src/controllers/accounts';
import { createNote } from '../src/controllers/notes';
import { signIn, signUp } from '../src/controllers/users';
import { Account } from '../src/entities/account';
import { Note } from '../src/entities/note';
import { User } from '../src/entities/user';
import { initPostgres } from '../src/postgres';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  loadConfig(__dirname + '/resources/config-example.json');
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

describe('Accountsコントローラー', () => {
  test('ローカルアカウントの作成', async () => {
    const repository = getRepository(Account);
    expect.assertions(5);

    expect(await Accounts.createLocalAccount('Asahi', 'Asahi')).toMatchObject({
      username: 'Asahi',
      host: null,
      name: 'Asahi',
      uri: null,
      inbox: null,
    });
    expect(await Accounts.createLocalAccount('Fuyuko', 'Fuyuko')).toMatchObject({
      username: 'Fuyuko',
      host: null,
      name: 'Fuyuko',
      uri: null,
      inbox: null,
    });
    expect(await Accounts.createLocalAccount('asahi', 'asahi')).toMatchObject({
      username: 'asahi',
      host: null,
      name: 'asahi',
      uri: null,
      inbox: null,
    });
    await expect(Accounts.createLocalAccount('Asahi', 'Asahi')).rejects.toThrowError();
    expect(await repository.findOne({ username: 'asahi', host: null })).toMatchObject({
      username: 'asahi',
      host: null,
      name: 'asahi',
      uri: null,
      inbox: null,
    });
  });

  test('リモートアカウントの作成', async () => {
    const repository = getRepository(Account);
    expect.assertions(5);

    expect(
      await Accounts.createRemoteAccount(
        'Asahi',
        'example.com',
        'Asahi',
        'https://example.com/Asahi',
        'https://example.com/inbox',
      ),
    ).toMatchObject({
      username: 'Asahi',
      host: 'example.com',
      name: 'Asahi',
      uri: 'https://example.com/Asahi',
      inbox: 'https://example.com/inbox',
    });
    expect(
      await Accounts.createRemoteAccount(
        'Fuyuko',
        'example.com',
        'Fuyuko',
        'https://example.com/Fuyuko',
        'https://example.com/inbox',
      ),
    ).toMatchObject({
      username: 'Fuyuko',
      host: 'example.com',
      name: 'Fuyuko',
      uri: 'https://example.com/Fuyuko',
      inbox: 'https://example.com/inbox',
    });
    expect(
      await Accounts.createRemoteAccount(
        'asahi',
        'example.com',
        'Asahi',
        'https://example.com/asahi',
        'https://example.com/inbox',
      ),
    ).toMatchObject({
      username: 'asahi',
      host: 'example.com',
      name: 'Asahi',
      uri: 'https://example.com/asahi',
      inbox: 'https://example.com/inbox',
    });
    await expect(
      Accounts.createRemoteAccount(
        'Asahi',
        'example.com',
        'Asahi',
        'https://example.com/asahi',
        'https://example.com/inbox',
      ),
    ).rejects.toThrowError();
    expect(await repository.findOne({ username: 'Fuyuko', host: 'example.com' })).toMatchObject({
      username: 'Fuyuko',
      host: 'example.com',
      name: 'Fuyuko',
      uri: 'https://example.com/Fuyuko',
      inbox: 'https://example.com/inbox',
    });
  });
});

describe('Notesコントローラー', () => {
  test('Noteの作成', async () => {
    const repository = getRepository(Note);
    expect.assertions(3);

    expect(await createNote('kaho', null, "Everybody let's go!")).toMatchObject({
      inReplyTo: null,
      content: "Everybody let's go!",
    });
    expect(await createNote('kaho', null, "Everybody let's go!")).toMatchObject({
      inReplyTo: null,
      content: "Everybody let's go!",
    });
    expect(await repository.count()).toBe(2);
  });
});
