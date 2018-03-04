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

import {toCodePoint} from '../../../../lang/to-code-point';

/**
 * Apply percent encoding on given code point if this code is part of the given encode-set,
 * otherwise returns the corresponding character.
 *
 * @param {number} c The character, or the code point.
 * @param {function} encodeSet A predicate that must returns `true` if the code must be percent-encoded, `false` otherwise.
 * @return {string} The percent-encoded character.
 */
export function percentEncode(c, encodeSet) {
  const codePoint = toCodePoint(c);
  return encodeSet(codePoint) ? utf8PercentEncode(c) : c;
}

/**
 * Appl UTF-8 percent encoding on given character.
 *
 * @param {string} c The given character.
 * @return {string} The UTF-8 percent encoding result.
 */
function utf8PercentEncode(c) {
  let str = '';

  for (let i = 0; i < c.length; ++i) {
    const codePoint = toCodePoint(c, i);
    str += toHexPercentEncode(codePoint);
  }

  return str;
}

/**
 * Translate a given code point to the corresponding UTF-8
 * percent encoding value.
 *
 * @param {number} c The code point.
 * @return {string} The percent-encoding value.
 */
function toHexPercentEncode(c) {
  let hex = c.toString(16).toUpperCase();
  if (hex.length === 1) {
    hex = `0${hex}`;
  }

  return `%${hex}`;
}
