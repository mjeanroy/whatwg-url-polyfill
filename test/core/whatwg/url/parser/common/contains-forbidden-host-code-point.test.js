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

import {containsForbiddenHostCodePoint} from 'src/core/whatwg/url/parser/common/contains-forbidden-host-code-point';

describe('containsForbiddenHostCodePoint', () => {
  it('should return false with nil', () => {
    expect(containsForbiddenHostCodePoint(null)).toBe(false);
    expect(containsForbiddenHostCodePoint(undefined)).toBe(false);
  });

  it('should return true a string containing a forbidden character', () => {
    expect(containsForbiddenHostCodePoint(`foo ${String.fromCharCode(0x000)} bar`)).toBe(true);
    expect(containsForbiddenHostCodePoint(`foo ${String.fromCharCode(0x0009)} bar`)).toBe(true);
    expect(containsForbiddenHostCodePoint(`foo ${String.fromCharCode(0x000A)} bar`)).toBe(true);
    expect(containsForbiddenHostCodePoint(`foo ${String.fromCharCode(0x000D)} bar`)).toBe(true);

    expect(containsForbiddenHostCodePoint('foo bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo#bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo%bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo%bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo/bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo:bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo?bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo@bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo[bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo\\bar')).toBe(true);
    expect(containsForbiddenHostCodePoint('foo]bar')).toBe(true);
  });

  it('should return false with a non forbidden character', () => {
    expect(containsForbiddenHostCodePoint('foobar')).toBe(false);
    expect(containsForbiddenHostCodePoint('a')).toBe(false);
    expect(containsForbiddenHostCodePoint('b')).toBe(false);
    expect(containsForbiddenHostCodePoint('0')).toBe(false);
    expect(containsForbiddenHostCodePoint('1')).toBe(false);
  });
});
