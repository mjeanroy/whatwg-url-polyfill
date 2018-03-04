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

import {isFunction} from './is-function';

const codePointAtFunction = isFunction(String.prototype.codePointAt) ?
  (input, i) => String.prototype.codePointAt.call(input, i) :
  (input, i) => {
    const first = input.charCodeAt(i);
    const size = input.length;

    // Take care of surrogate characters.
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/codePointAt
    if (first >= 0xD800 && first <= 0xDBFF && size > i + 1) {
      const second = str.charCodeAt(i + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return ((first - 0xD800) * 0x400) + second - 0xDC00 + 0x10000;
      }
    }

    return first;
  };

/**
 * Returns a non-negative integer that is the Unicode code point value.
 * Use `codePointAt` if method is available, fallback to `charCodeAt`.
 * TODO Use a more correct polyfill.
 *
 * @param {string} input Input string.
 * @param {number} idx Index of character.
 * @return {number} The unicode point.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
 */
export function codePointAt(input, idx) {
  return codePointAtFunction(input, idx);
}
