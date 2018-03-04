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

import {isC0ControlChar} from './is-c0-control-char';
import {isSpaceChar} from './is-space-char';

/**
 * As specifiec in the basic URL parser, this function will remove
 * leading and trailing C0 control or space.
 *
 * @param {string} input Input string.
 * @return {string} The trimmed string.
 * @see https://infra.spec.whatwg.org/#c0-control-or-space
 */
export function trimControlChars(input) {
  const startIdx = findStartIndex(input);
  if (startIdx === input.length) {
    return '';
  }

  return input.slice(startIdx, findEndIndex(input));
}

/**
 * Find the first character index that is not a control char or a space.
 *
 * @param {string} input Input string.
 * @return {number} The index of the first non control/space character.
 */
function findStartIndex(input) {
  for (let i = 0; i < input.length; ++i) {
    const c = input.charCodeAt(i);
    if (!isControlOrSpaceChar(c)) {
      return i;
    }
  }

  return input.length;
}

/**
 * Find the first character index starting from the end of the string
 * that is not a control char or a space.
 *
 * @param {string} input Input string.
 * @return {number} The index of the first non control/space character.
 */
function findEndIndex(input) {
  for (let i = input.length; i > 0; --i) {
    const c = input.charCodeAt(i - 1);
    if (!isControlOrSpaceChar(c)) {
      return i;
    }
  }

  return 0;
}

/**
 * Check if given code point is a control char or a space.
 *
 * @param {number} code Character code point (result of `charCodeAt`).
 * @return {boolean} `true` if `code` is a control char or a space, `false` otherwise.
 */
function isControlOrSpaceChar(code) {
  return isC0ControlChar(code) || isSpaceChar(code);
}
