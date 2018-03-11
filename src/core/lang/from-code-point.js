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

/* eslint-disable brace-style */

import {isFunction} from './is-function';

const fromCodePointFunc = isFunction(String.fromCodePoint) ?
  (codePoints) => String.fromCodePoint(...codePoints) :
  (codePoints) => {
    const length = codePoints.length;
    if (!length) {
      return '';
    }

    const MAX_SIZE = 0x4000;

    let codeUnits = [];
    let highSurrogate;
    let lowSurrogate;
    let index = -1;
    let result = '';

    while (++index < length) {
      let codePoint = Number(codePoints[index]);

      // Errors:
      // 1- Invalid values: `NaN`, `+Infinity`, or `-Infinity`.
      // 2- Not a valid Unicode code point if < 0.
      // 3- Not a valid Unicode code point if > 0x10FFFF.
      // 4- Not va valide code point if not an integer.
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || Math.floor(codePoint) != codePoint) {
        throw new RangeError(`Invalid code point: ${codePoint}`);
      }

      if (codePoint <= 0xFFFF) { // BMP code point
        codeUnits.push(codePoint);
      }

      // Astral code point; split in surrogate halves
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }

      if ((index + 1) === length || codeUnits.length > MAX_SIZE) {
        result += String.fromCharCode(...codeUnits);
        codeUnits = [];
      }
    }
    return result;
  };

/**
 * Returns a string created by using the specified sequence of code points.
 *
 * @param {Array<Number>} codePoints Sequence of code points.
 * @return {string} The output string.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
 */
export function fromCodePoint(...codePoints) {
  return fromCodePointFunc(codePoints);
}
