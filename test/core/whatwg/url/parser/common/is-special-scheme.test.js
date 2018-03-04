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

import {isSpecialScheme} from 'src/core/whatwg/url/parser/common/is-special-scheme';

describe('isSpecialScheme', () => {
  it('should return true with a special scheme', () => {
    expect(isSpecialScheme('ftp')).toBe(true);
    expect(isSpecialScheme('file')).toBe(true);
    expect(isSpecialScheme('gopher')).toBe(true);
    expect(isSpecialScheme('http')).toBe(true);
    expect(isSpecialScheme('https')).toBe(true);
    expect(isSpecialScheme('ws')).toBe(true);
    expect(isSpecialScheme('wss')).toBe(true);
  });

  it('should return true with an upper case special scheme', () => {
    expect(isSpecialScheme('FTP')).toBe(true);
    expect(isSpecialScheme('FILE')).toBe(true);
    expect(isSpecialScheme('GOPHER')).toBe(true);
    expect(isSpecialScheme('HTTP')).toBe(true);
    expect(isSpecialScheme('HTTPS')).toBe(true);
    expect(isSpecialScheme('WS')).toBe(true);
    expect(isSpecialScheme('WSS')).toBe(true);
  });
});
