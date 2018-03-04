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

import {startsWithWindowsDriveLetter} from 'src/core/whatwg/url/parser/common/starts-with-windows-drive-letter';

describe('startsWithWindowsDriveLetter', () => {
  it('should return false with nil or empty string', () => {
    expect(startsWithWindowsDriveLetter(null)).toBe(false);
    expect(startsWithWindowsDriveLetter(undefined)).toBe(false);
    expect(startsWithWindowsDriveLetter('')).toBe(false);
  });

  it('should return false with [ALPHA]', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(startsWithWindowsDriveLetter(letter)).toBe(false);
    }
  });

  it('should return false with [NON_ALPHA]://', () => {
    for (let i = 0; i < 10; ++i) {
      const letter = String.fromCharCode('0'.charCodeAt(0) + i);
      expect(startsWithWindowsDriveLetter(`${letter}://`)).toBe(false);
    }
  });

  it('should return true with "[ALPHA]:"', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(startsWithWindowsDriveLetter(`${letter}:`)).toBe(true);
    }
  });

  it('should return true with "[ALPHA]://[TEXT]"', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(startsWithWindowsDriveLetter(`${letter}://test`)).toBe(true);
    }
  });

  it('should return true with "[ALPHA]:\\"', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(startsWithWindowsDriveLetter(`${letter}:\\`)).toBe(true);
    }
  });

  it('should return true with "[ALPHA]:?"', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(startsWithWindowsDriveLetter(`${letter}:?`)).toBe(true);
    }
  });

  it('should return true with "[ALPHA]:#"', () => {
    for (let i = 0; i < 26; ++i) {
      const letter = String.fromCharCode('a'.charCodeAt(0) + i);
      expect(startsWithWindowsDriveLetter(`${letter}:#`)).toBe(true);
    }
  });
});
