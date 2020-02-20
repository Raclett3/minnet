const config = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.MINNET_DB_USERNAME,
  password: process.env.MINNET_DB_PASSWORD,
  database: 'minnet',
  synchronize: false,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'migrations',
  },
};

export = config;
