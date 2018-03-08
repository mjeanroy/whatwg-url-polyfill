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

import {isForbiddenHostCodePoint} from 'src/core/whatwg/url/parser/common/is-forbidden-host-code-point';

describe('isForbiddenHostCodePoint', () => {
  it('should return false with nil', () => {
    expect(isForbiddenHostCodePoint(null)).toBe(false);
    expect(isForbiddenHostCodePoint(undefined)).toBe(false);
  });

  it('should return true a forbidden character', () => {
    expect(isForbiddenHostCodePoint(0x000)).toBe(true);
    expect(isForbiddenHostCodePoint(0x0009)).toBe(true);
    expect(isForbiddenHostCodePoint(0x000A)).toBe(true);
    expect(isForbiddenHostCodePoint(0x000D)).toBe(true);

    expect(isForbiddenHostCodePoint(' ')).toBe(true);
    expect(isForbiddenHostCodePoint('#')).toBe(true);
    expect(isForbiddenHostCodePoint('%')).toBe(true);
    expect(isForbiddenHostCodePoint('%')).toBe(true);
    expect(isForbiddenHostCodePoint('/')).toBe(true);
    expect(isForbiddenHostCodePoint(':')).toBe(true);
    expect(isForbiddenHostCodePoint('?')).toBe(true);
    expect(isForbiddenHostCodePoint('@')).toBe(true);
    expect(isForbiddenHostCodePoint('[')).toBe(true);
    expect(isForbiddenHostCodePoint('\\')).toBe(true);
    expect(isForbiddenHostCodePoint(']')).toBe(true);
  });

  it('should return false with a non forbidden character', () => {
    expect(isForbiddenHostCodePoint('a')).toBe(false);
    expect(isForbiddenHostCodePoint('b')).toBe(false);
    expect(isForbiddenHostCodePoint('0')).toBe(false);
    expect(isForbiddenHostCodePoint('1')).toBe(false);
  });
});
