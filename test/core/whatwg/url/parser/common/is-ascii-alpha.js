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

import {codePointAt} from '../../../lang/code-point-at';

const LOWER_A_CODE = 0x0061;
const LOWER_Z_CODE = 0x007A;
const UPPER_A_CODE = 0x0041;
const UPPER_Z_CODE = 0x005A;

/**
 * Check if a given character is an alpha numeric character.
 *
 * @param {string} c The character.
 * @return {boolean} `true` if `c` is an alpha-numeric character, `false` otherwise.
 * @see https://infra.spec.whatwg.org/#ascii-alpha
 */
export function isAsciiAlpha(c) {
  if (!c) {
    return false;
  }

  const code = codePointAt(c, 0);
  return isLowerAlpha(code) || isUpperAlpha(code);
}

/**
 * Check if given code point is a lower alpha character.
 *
 * @param {number} codePoint The code point.
 * @return {boolean} `true` if `c` is a lower alpha character code point, `false` otherwise.
 */
function isLowerAlpha(codePoint) {
  return codePoint >= LOWER_A_CODE && codePoint <= LOWER_Z_CODE;
}

/**
 * Check if given code point is an upper alpha character.
 *
 * @param {number} codePoint The code point.
 * @return {boolean} `true` if `c` is an upper alpha character code point, `false` otherwise.
 */
function isUpperAlpha(codePoint) {
  return codePoint >= UPPER_A_CODE && codePoint <= UPPER_Z_CODE;
}
