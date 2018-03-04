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

import {isChar} from '../../../../lang/is-char';
import {isNil} from '../../../../lang/is-nil';
import {isFragmentPercentEncodeSet} from '../common/is-fragment-percent-encode-set';
import {isUrlCodePoint} from '../common/is-url-code-point';
import {percentEncode} from '../common/percent-encode';
import {startsWithAsciiHexDigit} from '../common/starts-with-ascii-hex-digit';

/**
 * Algorithm for the `fragment state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#file-state
 */
export function fragmentState(sm, c) {
  // 1- Switching on c:

  // 1-1 The EOF code point
  // -> Do nothing.
  if (isNil(c)) {
    return;
  }

  // 1-2 U+0000 NULL
  // -> Validation error.
  else if (isChar(c, 0x0000)) {
    sm.validationError = true;
  }

  // 1-3 Otherwise
  else {
    // 1-3-1 If c is not a URL code point and not U+0025 (%), validation error.
    if (!isUrlCodePoint(c) && !isChar(c, '%')) {
      sm.validationError = true;
    }

    // 1-3-2 If c is U+0025 (%) and remaining does not start with two ASCII hex digits, validation error.
    if (isChar(c, '%') && (!startsWithAsciiHexDigit(sm.input.slice(sm.pointer + 1)))) {
      sm.validationError = true;
    }

    // 1-3-3 UTF-8 percent encode c using the fragment percent-encode set and append the result to url’s fragment.
    sm.url.fragment += percentEncode(c, isFragmentPercentEncodeSet);
  }
}
