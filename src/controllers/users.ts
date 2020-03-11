import * as bcrypt from 'bcrypt';
import { generateKeyPair, KeyObject } from 'crypto';
import { getConnection } from 'typeorm';

import { Account } from '../entities/account';
import { User } from '../entities/user';
import { generateId } from '../helpers/generate-id';
import { validateUsername } from '../helpers/validators';
import { ControllerError } from './error';

export async function signUp(username: string, plainPassword: string, name: string): Promise<User> {
  if (!validateUsername(username)) {
    throw new ControllerError('The username is invalid');
  }

  return await getConnection().transaction<User>(async transaction => {
    const exist = await transaction.findOne(Account, { username: username });
    if (exist) {
      throw new ControllerError('The username already exists');
    }

    const encryptedPassword = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(plainPassword, 10, (err, encrypted) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(encrypted);
      });
    });

    const [privateKey, publicKey] = await new Promise<[string, string]>((resolve, reject) => {
      generateKeyPair('rsa', { modulusLength: 2048 }, (err, privateKey, publicKey) => {
        if (err) {
          reject(err);
          return;
        }

        const exportKey = (key: KeyObject): string => {
          const result = key.export({ format: 'pem', type: 'pkcs1' });
          return typeof result === 'string' ? result : result.toString('utf-8');
        };

        resolve([exportKey(privateKey), exportKey(publicKey)]);
      });
    });

    const account = new Account(generateId(), username, null, name, null, null);
    const user = new User(username, encryptedPassword, account, privateKey, publicKey);
    await transaction.insert(Account, account);
    await transaction.insert(User, user);

    return user;
  });
}

export async function signIn(username: string, plainPassword: string): Promise<string | null> {
  return await getConnection().transaction(async transaction => {
    const user = await transaction.findOne(User, { username: username });
    if (!user) {
      return null;
    }

    const isSuccess = await new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(plainPassword, user.encryptedPassword, (err, encrypted) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(encrypted);
      });
    });

    if (!isSuccess) {
      return null;
    }

    return user.account.id;
  });
}
