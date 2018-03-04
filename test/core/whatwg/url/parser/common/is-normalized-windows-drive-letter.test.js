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

import {isNormalizedWindowsDriveLetter} from 'src/core/whatwg/url/parser/common/is-normalized-windows-drive-letter';

describe('isNormalizedWindowsDriveLetter', () => {
  it('should return false with nil or empty string', () => {
    expect(isNormalizedWindowsDriveLetter(null)).toBe(false);
    expect(isNormalizedWindowsDriveLetter(undefined)).toBe(false);
    expect(isNormalizedWindowsDriveLetter('')).toBe(false);
  });

  it('should return false with string of length 1', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(isNormalizedWindowsDriveLetter(letter)).toBe(false);
    }
  });

  it('should return true with [LOWER(ALPHA)]:', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(isNormalizedWindowsDriveLetter(`${letter}:`)).toBe(true);
    }
  });

  it('should return false with [LOWER(ALPHA)]\\', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(isNormalizedWindowsDriveLetter(`${letter}\\`)).toBe(false);
    }
  });

  it('should return true with [UPPER(ALPHA)]:', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('A'.charCodeAt(0) + i);
      expect(isNormalizedWindowsDriveLetter(`${letter}:`)).toBe(true);
    }
  });

  it('should return false with [UPPER(ALPHA)]\\', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('A'.charCodeAt(0) + i);
      expect(isNormalizedWindowsDriveLetter(`${letter}\\`)).toBe(false);
    }
  });

  it('should return false with [NON_ALPHA)]:', () => {
    for (let i = 0; i < 10; ++i) {
      const letter = String.fromCharCode('0'.charCodeAt(0) + i);
      expect(isNormalizedWindowsDriveLetter(`${letter}:`)).toBe(false);
    }
  });

  it('should return false with [NON_ALPHA)]\\', () => {
    for (let i = 0; i < 10; ++i) {
      const letter = String.fromCharCode('0'.charCodeAt(0) + i);
      expect(isNormalizedWindowsDriveLetter(`${letter}\\`)).toBe(false);
    }
  });
});
