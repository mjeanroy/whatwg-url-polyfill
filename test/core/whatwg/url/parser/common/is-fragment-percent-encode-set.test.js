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

import {isFragmentPercentEncodeSet} from 'src/core/whatwg/url/parser/common/is-fragment-percent-encode-set';

describe('isFragmentPercentEncodeSet', () => {
  it('should return false with nil', () => {
    expect(isFragmentPercentEncodeSet(null)).toBe(false);
    expect(isFragmentPercentEncodeSet(undefined)).toBe(false);
  });

  it('should return true with ", <, >, or `', () => {
    expect(isFragmentPercentEncodeSet(toCharCode('"'))).toBe(true);
    expect(isFragmentPercentEncodeSet(toCharCode('<'))).toBe(true);
    expect(isFragmentPercentEncodeSet(toCharCode('>'))).toBe(true);
    expect(isFragmentPercentEncodeSet(toCharCode('`'))).toBe(true);
  });

  it('should return true with SPACE', () => {
    expect(isFragmentPercentEncodeSet(toCharCode(' '))).toBe(true);
  });

  it('should return true with C0 Control characters', () => {
     for (let i = 0x0000; i <= 0x001F; i++) {
       expect(isFragmentPercentEncodeSet(i)).toBe(true);
     }
  });

  /**
   * Get the char code associated to given character.
   *
   * @param {string} char The character.
   * @return {number} The char code.
   */
  function toCharCode(char) {
    return char.charCodeAt(0);
  }
});
