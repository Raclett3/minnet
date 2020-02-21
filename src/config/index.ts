import { existsSync, readFileSync } from 'fs';

export type Config = {
  host: string;
};

export function validateConfig(config: Config) {
  return typeof config.host === 'string';
}

export function parseConfig(json: string): Config {
  try {
    return JSON.parse(json);
  } catch (err) {
    throw Error('Configのパースに失敗しました。');
  }
}

const configCache: { [key: string]: Config } = {};

export function loadConfig(filename: string): Config {
  if (filename in configCache) {
    return configCache[filename];
  }

  if (!existsSync(filename)) {
    throw Error('Configファイルが存在しません。');
  }

  const rawConfig = readFileSync(filename, { encoding: 'utf-8' });
  const config = parseConfig(rawConfig);

  if (!validateConfig(config)) {
    throw Error('Configファイルのプロパティのいくつかが不正です。');
  }

  configCache[filename] = config;

  return config;
}
