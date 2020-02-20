import * as Config from '../src/config';

describe('Config', () => {
  const config: Config.Config = { host: 'example.com' };

  test('Configの読み込み', () => {
    expect.assertions(2);

    expect(Config.loadConfig(__dirname + '/resources/config-example.json')).toMatchObject(config);
    expect(() => Config.loadConfig(__dirname + '/resources/<0nf1g-3x4mple.json')).toThrowError(
      'Configファイルが存在しません。',
    );
  });

  test('Configのパース', () => {
    expect.assertions(2);

    expect(Config.parseConfig('{"host": "example.com"}')).toMatchObject(config);
    expect(() => Config.parseConfig('INVALID STRING')).toThrowError('Configのパースに失敗しました。');
  });

  test('Configのバリデーション', () => {
    expect.assertions(2);

    const invalidConfig: Config.Config = ({ host: 2 } as unknown) as Config.Config;
    expect(Config.validateConfig(config)).toBeTruthy();
    expect(Config.validateConfig(invalidConfig)).toBeFalsy();
  });
});
