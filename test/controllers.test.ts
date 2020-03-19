import { getRepository } from 'typeorm';

import { loadConfig } from '../src/config';
import * as Accounts from '../src/controllers/accounts';
import * as Follows from '../src/controllers/follows';
import { createNote } from '../src/controllers/notes';
import { signIn, signUp } from '../src/controllers/users';
import { Account } from '../src/entities/account';
import { Follow } from '../src/entities/follow';
import { Note } from '../src/entities/note';
import { User } from '../src/entities/user';
import { generateId } from '../src/helpers/generate-id';
import { initPostgres } from '../src/postgres';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  loadConfig(__dirname + '/resources/config-example.json');
  await initPostgres();
});

async function resolveEntity(entity: any) {
  for (const key of Object.keys(entity)) {
    if (entity[key] instanceof Promise) {
      entity[key] = await entity[key];
    } else if (entity[key] && typeof entity[key] === 'object') {
      resolveEntity(entity[key]);
    }
  }
  return entity;
}

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
        publicKey: null,
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
        publicKey: null,
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
      publicKey: null,
    });
    expect(await Accounts.createLocalAccount('Fuyuko', 'Fuyuko')).toMatchObject({
      username: 'Fuyuko',
      host: null,
      name: 'Fuyuko',
      uri: null,
      inbox: null,
      publicKey: null,
    });
    expect(await Accounts.createLocalAccount('asahi', 'asahi')).toMatchObject({
      username: 'asahi',
      host: null,
      name: 'asahi',
      uri: null,
      inbox: null,
      publicKey: null,
    });
    await expect(Accounts.createLocalAccount('Asahi', 'Asahi')).rejects.toThrowError();
    expect(await repository.findOne({ username: 'asahi', host: null })).toMatchObject({
      username: 'asahi',
      host: null,
      name: 'asahi',
      uri: null,
      inbox: null,
      publicKey: null,
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
        'publicKey',
      ),
    ).toMatchObject({
      username: 'Asahi',
      host: 'example.com',
      name: 'Asahi',
      uri: 'https://example.com/Asahi',
      inbox: 'https://example.com/inbox',
      publicKey: 'publicKey',
    });
    expect(
      await Accounts.createRemoteAccount(
        'Fuyuko',
        'example.com',
        'Fuyuko',
        'https://example.com/Fuyuko',
        'https://example.com/inbox',
        'publicKey',
      ),
    ).toMatchObject({
      username: 'Fuyuko',
      host: 'example.com',
      name: 'Fuyuko',
      uri: 'https://example.com/Fuyuko',
      inbox: 'https://example.com/inbox',
      publicKey: 'publicKey',
    });
    expect(
      await Accounts.createRemoteAccount(
        'asahi',
        'example.com',
        'Asahi',
        'https://example.com/asahi',
        'https://example.com/inbox',
        'publicKey',
      ),
    ).toMatchObject({
      username: 'asahi',
      host: 'example.com',
      name: 'Asahi',
      uri: 'https://example.com/asahi',
      inbox: 'https://example.com/inbox',
      publicKey: 'publicKey',
    });
    await expect(
      Accounts.createRemoteAccount(
        'Asahi',
        'example.com',
        'Asahi',
        'https://example.com/asahi',
        'https://example.com/inbox',
        'publicKey',
      ),
    ).rejects.toThrowError();
    expect(await repository.findOne({ username: 'Fuyuko', host: 'example.com' })).toMatchObject({
      username: 'Fuyuko',
      host: 'example.com',
      name: 'Fuyuko',
      uri: 'https://example.com/Fuyuko',
      inbox: 'https://example.com/inbox',
      publicKey: 'publicKey',
    });
  });
});

describe('Notesコントローラー', () => {
  test('Noteの作成', async () => {
    const repository = getRepository(Note);
    expect.assertions(3);

    expect(await resolveEntity(await createNote('kaho', null, "Everybody let's go!"))).toMatchObject({
      inReplyTo: null,
      content: "Everybody let's go!",
    });
    expect(await resolveEntity(await createNote('kaho', null, "Everybody let's go!"))).toMatchObject({
      inReplyTo: null,
      content: "Everybody let's go!",
    });
    expect(await repository.count()).toBe(2);
  });
});

describe('Followコントローラー', () => {
  const accounts: { [key: string]: Account } = {};
  beforeAll(async () => {
    const names = ['Yuika', 'Mamimi', 'Sakuya', 'Kiriko'];

    for (const name of names) {
      const account = await Accounts.createRemoteAccount(
        name,
        'example.com',
        name,
        `https://example.com/${name}`,
        'https://example.com/inbox',
        'publicKey',
      );

      accounts[name] = account;
    }

    const account = await Accounts.createLocalAccount('Kogane', 'Kogane');
    accounts['Kogane'] = account;
  });

  test('Followの作成', async () => {
    expect.assertions(3);

    const repository = getRepository(Follow);

    expect(await repository.save(new Follow(generateId(), accounts['Mamimi'], accounts['Kogane']))).toMatchObject({
      follower: accounts['Mamimi'],
      followee: accounts['Kogane'],
    });
    expect(await repository.save(new Follow(generateId(), accounts['Kiriko'], accounts['Kogane']))).toMatchObject({
      follower: accounts['Kiriko'],
      followee: accounts['Kogane'],
    });
    await expect(
      repository.save(new Follow(generateId(), accounts['Mamimi'], accounts['Kogane'])),
    ).rejects.toThrowError();
  });

  test('Inbox一覧の取得', async () => {
    expect(await Follows.followerInboxes(accounts['Kogane'].id)).toMatchObject(['https://example.com/inbox']);
    expect(await Follows.followerInboxes('Mano')).toMatchObject([]);
  });
});
