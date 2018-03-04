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
import {isWindowsDriveLetter} from './is-windows-drive-letter';

/**
 * Check if a string input starts with a windows drive letter.
 *
 * @param {string} input The input string.
 * @return {boolean} `true` if input starts with a windows drive letter, `false` otherwise.
 * @see https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
 */
export function startsWithWindowsDriveLetter(input) {
  // A string starts with a Windows drive letter if all of the following are true:

  // - its length is greater than or equal to 2
  if (!input || input.length < 2) {
    return false;
  }

  // - its first two code points are a Windows drive letter
  if (!isWindowsDriveLetter(input.slice(0, 2))) {
    return false;
  }

  // - its length is 2 or its third code point is U+002F (/), U+005C (\), U+003F (?), or U+0023 (#).
  if (input.length === 2) {
    return true;
  }

  const third = input[2];
  return isChar(third, '/') || isChar(third, '\\') || isChar(third, '?') || isChar(third, '#');
}
