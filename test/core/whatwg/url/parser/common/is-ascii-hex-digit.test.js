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

import {isAsciiHexDigit} from 'src/core/whatwg/url/parser/common/is-ascii-hex-digit';

describe('isAsciiHexDigit', () => {
  it('should return false nil or the empty string', () => {
    expect(isAsciiHexDigit(null)).toBe(false);
    expect(isAsciiHexDigit(undefined)).toBe(false);
    expect(isAsciiHexDigit('')).toBe(false);
  });

  it('should return ftrue with character between 0 and 9', () => {
    for (let i = 0; i <= 9; ++i) {
      const c = i.toString();
      expect(isAsciiHexDigit(c)).toBe(true);
    }
  });

  it('should return true with alpha characters between lower "a" and lower "f"', () => {
    for (let i = 0; i < 6; ++i) {
      const char = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(isAsciiHexDigit(char)).toBe(true);
    }
  });

  it('should return true with alpha characters between upper "A" and upper "F"', () => {
    for (let i = 0; i < 6; ++i) {
      const char = String.fromCharCode('A'.charCodeAt(0) + i);
      expect(isAsciiHexDigit(char)).toBe(true);
    }
  });

  it('should return false with alpha characters outside "A" and "F" bounds', () => {
    for (let i = 0; i < 20; ++i) {
      const char = String.fromCharCode('G'.charCodeAt(0) + i);
      expect(isAsciiHexDigit(char)).toBe(false);
    }
  });

  it('should return false with alpha characters outside "a" and "f" bounds', () => {
    for (let i = 0; i < 20; ++i) {
      const char = String.fromCharCode('g'.charCodeAt(0) + i);
      expect(isAsciiHexDigit(char)).toBe(false);
    }
  });
});
