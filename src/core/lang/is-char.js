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

import {isString} from './is-string';
import {codePointAt} from './code-point-at';

/**
 * Check if actual character is equal to expected character.
 * Note that this function handle `string` value or code point value.
 *
 * @param {string|number} actual The actual character, as a `string` or a code point.
 * @param {string|number} expected The expected character, as a `string` or a code point.
 * @return {boolean} `true` if `actual` is the same character as `expected`, `false` otherwise.
 */
export function isChar(actual, expected) {
  if (actual === expected) {
    return true;
  }

  const actualIsString = isString(actual);
  const expectedIsString = isString(expected);
  if (actualIsString && expectedIsString) {
    return false;
  }

  const c1 = actualIsString ? codePointAt(actual, 0) : actual;
  const c2 = expectedIsString ? codePointAt(expected, 0) : expected;
  return c1 === c2;
}
