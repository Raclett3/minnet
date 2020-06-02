import { parseHTML } from '../src/helpers/parse-html';

describe('Helper関数', () => {
  test('parseHTML', () => {
    expect.assertions(6);
    expect(parseHTML('a<br>b')).toBe('a\nb');
    expect(parseHTML('<p>a</p>b')).toBe('a\nb');
    expect(parseHTML('<p>a</p><p>b</p>')).toBe('a\nb');
    expect(parseHTML('<p>a</p><span>b</span>')).toBe('a\nb');
    expect(parseHTML('<p>a</p><br><p>b</p>')).toBe('a\n\nb');
    expect(parseHTML('<p>a</p><br><p>b</p>')).toBe('a\n\nb');
  });
});
