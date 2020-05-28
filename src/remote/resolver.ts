import axios from 'axios';
import { getRepository } from 'typeorm';
import { URL } from 'url';

import { createRemoteAccount } from '../controllers/accounts';
import { createNote } from '../controllers/notes';
import { Account } from '../entities/account';
import { Note } from '../entities/note';
import { validateNote, validateRemoteUsername } from '../helpers/validators';

async function resolve(uri: string) {
  const result = await axios.get(uri, {
    headers: { Accept: 'application/activity+json, application/ld+json' },
  });

  return result.data;
}

export async function resolveAccount(uri: string) {
  const repository = getRepository(Account);

  const account = await repository.findOne({ uri: uri });

  if (account) {
    return account;
  }

  const resolved = await resolve(uri);

  const host = new URL(uri).host;
  const expectedTypes = ['Person', 'Service'];

  if (
    !resolved ||
    typeof resolved.type !== 'string' ||
    !expectedTypes.includes(resolved.type) ||
    typeof resolved.inbox !== 'string' ||
    typeof resolved.id !== 'string' ||
    new URL(resolved.id).host !== host ||
    typeof resolved.preferredUsername !== 'string' ||
    !validateRemoteUsername(resolved.preferredUsername) ||
    !resolved.publicKey ||
    typeof resolved.publicKey !== 'object' ||
    typeof resolved.publicKey.publicKeyPem !== 'string'
  ) {
    throw new Error();
  }

  const { preferredUsername, name, inbox, publicKey } = resolved;
  const created = await createRemoteAccount(
    preferredUsername,
    host,
    name || preferredUsername,
    uri,
    inbox,
    publicKey.publicKeyPem,
  );

  return created;
}

export async function resolveNote(uri: string) {
  const repository = getRepository(Note);

  const note = await repository.findOne({ uri: uri });

  if (note) {
    return note;
  }

  const resolved = await resolve(uri);

  const host = new URL(uri).host;

  if (!validateNote(resolved, host)) {
    throw new Error();
  }

  const { content, published, attributedTo, inReplyTo } = resolved;
  const account = await resolveAccount(attributedTo);

  return await createNote(
    { uri: account.uri || undefined },
    { content: content, createdAt: new Date(published), uri: uri, inReplyToId: inReplyTo },
  );
}
