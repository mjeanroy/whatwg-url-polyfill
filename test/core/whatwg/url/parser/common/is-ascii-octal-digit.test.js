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

import {isAsciiOctalDigit} from 'src/core/whatwg/url/parser/common/is-ascii-octal-digit';

describe('isAsciiOctalDigit', () => {
  it('should return false nil or the empty string', () => {
    expect(isAsciiOctalDigit(null)).toBe(false);
    expect(isAsciiOctalDigit(undefined)).toBe(false);
    expect(isAsciiOctalDigit('')).toBe(false);
  });

  it('should return true with character between 0 and 7', () => {
    for (let i = 0; i <= 7; ++i) {
      const c = i.toString();
      expect(isAsciiOctalDigit(c)).toBe(true);
    }
  });

  it('should return false with 8 and 9', () => {
    expect(isAsciiOctalDigit('8')).toBe(false);
    expect(isAsciiOctalDigit('9')).toBe(false);
  });

  it('should return false with lower alpha characters', () => {
    for (let i = 0; i < 26; ++i) {
      const char = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(isAsciiOctalDigit(char)).toBe(false);
    }
  });

  it('should return false with upper alpha characters', () => {
    for (let i = 0; i < 26; ++i) {
      const char = String.fromCharCode('A'.charCodeAt(0) + i);
      expect(isAsciiOctalDigit(char)).toBe(false);
    }
  });
});
