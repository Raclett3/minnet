import { createConnection, getConnection } from 'typeorm';

import { Account } from './entities/account';
import { User } from './entities/user';

export function initPostgres() {
  try {
    return Promise.resolve(getConnection());
  } catch {
    const isTest = process.env.NODE_ENV === 'test';
    return createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.MINNET_DB_USERNAME,
      password: process.env.MINNET_DB_PASSWORD,
      database: isTest ? 'minnet_test' : 'minnet',
      synchronize: isTest,
      dropSchema: isTest,
      logging: false,
      entities: [Account, User],
    });
  }
}
