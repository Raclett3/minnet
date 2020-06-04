import { Account } from '../../../entities/account';

export type APIAccount = Omit<Account, 'inbox' | 'publicKey'>;

export function toAPIAccount(account: Account): APIAccount {
  const { publicKey: _1, inbox: _2, ...rest } = account;

  return rest;
}
