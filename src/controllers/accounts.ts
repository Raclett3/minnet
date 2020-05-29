import { getConnection } from 'typeorm';
import { URL } from 'url';

import { Account } from '../entities/account';
import { generateId } from '../helpers/generate-id';
import { validateRemoteUsername, validateUsername } from '../helpers/validators';
import { ControllerError } from './error';

function validateURI(uri: string, host: string) {
  const validator = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
  const parsed = new URL(uri);
  return validator.test(host) && parsed.host === host;
}

export async function createRemoteAccount(
  username: string,
  host: string,
  name: string,
  uri: string,
  inbox: string,
  publicKey: string,
): Promise<Account> {
  if (!validateRemoteUsername(username)) {
    throw new ControllerError('The username is invalid');
  }

  if (!validateURI(uri, host)) {
    throw new ControllerError('The URI is invalid');
  }

  if (!validateURI(inbox, host)) {
    throw new ControllerError('The inbot URI is invalid');
  }

  return await getConnection().transaction(async transaction => {
    const exist = await transaction.findOne(Account, { username: username, host: host });
    if (exist) {
      throw new ControllerError('The username and host already exists');
    }

    const account = new Account(generateId(), username, host, name, uri, inbox, publicKey);
    await transaction.insert(Account, account);
    return account;
  });
}

export async function createLocalAccount(username: string, name: string): Promise<Account> {
  if (!validateUsername(username)) {
    throw new ControllerError('The username is invalid');
  }

  return await getConnection().transaction(async transaction => {
    const exist = await transaction.findOne(Account, { username: username });
    if (exist) {
      throw new ControllerError('The username already exists');
    }

    const account = new Account(generateId(), username, null, name, null, null, null);
    await transaction.insert(Account, account);
    return account;
  });
}
