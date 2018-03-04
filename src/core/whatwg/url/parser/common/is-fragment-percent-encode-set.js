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
import {isNil} from '../../../../lang/is-nil';
import {isSpaceChar} from './is-space-char';
import {isC0ControlPercentEncodeSet} from './is-c0-control-percent-encode-set';

/**
 * Check if the given character is part of the fragment percent encode set.
 *
 * @param {number} c The code point to check.
 * @return {boolean} `true` if code point is part of the fragment percent encode set, `false` otherwise.
 * @see https://url.spec.whatwg.org/#fragment-percent-encode-set
 */
export function isFragmentPercentEncodeSet(c) {
  if (isNil(c)) {
    return false;
  }

  // The fragment percent-encode set is the C0 control percent-encode set
  // and U+0020 SPACE, U+0022 ("), U+003C (<), U+003E (>), and U+0060 (`).
  return isC0ControlPercentEncodeSet(c) || isSpaceChar(c) || isChar(c, '"') || isChar(c, '<') || isChar(c, '>') || isChar(c, '`');
}
