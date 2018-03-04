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

import {isChar} from '../../../../lang/is-char';

/**
 * As specifiec in the basic URL parser, this function will remove
 * tabs and new-line characters from input string.
 *
 * @param {string} input Input string.
 * @return {string} The new string.
 * @see https://infra.spec.whatwg.org/#ascii-tab-or-newline
 */
export function removeTabAndNewLine(input) {
  if (!input) {
    return input;
  }

  let output = '';

  for (let i = 0; i < input.length; ++i) {
    if (!shouldSkip(input.charCodeAt(i))) {
      output += input.charAt(i);
    }
  }

  return output;
}

/**
 * Check if the char code point should be skipped (if the char code is
 * the tabulation or the new-line or the carriage-return character).
 *
 * @param {number} code The character code point.
 * @return {boolean} `true` if the character should be skipped, `false` otherwise.
 */
function shouldSkip(code) {
  return isTAB(code) || isNL(code) || isRC(code);
}

/**
 * Check if code point is the tabulation characther.
 *
 * @param {number} code The code point.
 * @return {boolean} `true` if the char code is the tabulation character.
 */
function isTAB(code) {
  return isChar(code, 0x0009);
}

/**
 * Check if code point is the new-line characther.
 *
 * @param {number} code The code point.
 * @return {boolean} `true` if the char code is the new-line character.
 */
function isNL(code) {
  return isChar(code, 0x000A);
}

/**
 * Check if code point is the carriage-return characther.
 *
 * @param {number} code The code point.
 * @return {boolean} `true` if the char code is the carriage-return character.
 */
function isRC(code) {
  return isChar(code, 0x000D);
}
