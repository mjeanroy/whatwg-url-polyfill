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
import {isAsciiAlpha} from './is-ascii-alpha';

/**
 * Check if input is a windows drive letter.
 *
 * @param {string} input The input string.
 * @return {boolean} `true` if `input` is a windows drive letter, `false` otherwise.
 * @see https://url.spec.whatwg.org/#windows-drive-letter
 */
export function isWindowsDriveLetter(input) {
  if (!input || input.length !== 2) {
    return false;
  }

  // A Windows drive letter is two code points, of which the first is an ASCII
  // alpha and the second is either U+003A (:) or U+007C (|).
  return isAsciiAlpha(input[0]) && (isChar(input[1], ':') || isChar(input[1], '\\'));
}
