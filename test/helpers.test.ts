import { convertToHTML } from '../src/helpers/convert-to-html';
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

  test('convertToHTML', () => {
    expect.assertions(2);
    expect(convertToHTML('abc\ndef')).toBe('abc<br>def');
    expect(convertToHTML('<abc>\n<&def>')).toBe('&lt;abc&gt;<br>&lt;&amp;def&gt;');
  });
});
