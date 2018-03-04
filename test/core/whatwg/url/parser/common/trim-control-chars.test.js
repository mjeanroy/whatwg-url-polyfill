/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {trimControlChars} from 'src/core/whatwg/url/parser/common/trim-control-chars';

describe('trimControlChars', () => {
  it('should not change empty string', () => {
    expect(trimControlChars('')).toBe('');
  });

  it('should trim string containing only space', () => {
    expect(trimControlChars('    ')).toBe('');
  });

  it('should not change simple input string', () => {
    expect(trimControlChars('foo')).toBe('foo');
  });

  it('should trim spaces from input string', () => {
    expect(trimControlChars('  foo  ')).toBe('foo');
  });

  it('should trim C0 characters from input string', () => {
    for (let i = 0; i < 32; ++i) {
      const hex = parseInt(i.toString(16), 16);
      const c = String.fromCharCode(hex);
      const input = `${c}foo${c}`;
      expect(trimControlChars(input)).toBe('foo');
    }
  });
});
