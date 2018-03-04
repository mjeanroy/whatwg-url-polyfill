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
import {isC0ControlPercentEncodeSet} from '../common/is-c0-control-percent-encode-set';
import {isUrlCodePoint} from '../common/is-url-code-point';
import {percentEncode} from '../common/percent-encode';
import {startsWithAsciiHexDigit} from '../common/starts-with-ascii-hex-digit';
import {FRAGMENT_STATE, QUERY_STATE} from './states';

/**
 * Algorithm for the `cannot-be-a-base-URL path state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#cannot-be-a-base-url-path-state
 */
export function cannotBeABaseURLPathState(sm, c) {
  // 1- If c is U+003F (?), then set url’s query to the empty string and state to query state.
  if (isChar(c, '?')) {
    sm.url.query = '';
    sm.state = QUERY_STATE;
  }

  // 2- Otherwise, if c is U+0023 (#), then set url’s fragment to the empty string and state to fragment state.
  else if (isChar(c, '#')) {
    sm.url.fragment = '';
    sm.state = FRAGMENT_STATE;
  }

  // 3- Otherwise:
  else {
    // 3-1 If c is not the EOF code point, not a URL code point, and not U+0025 (%), validation error.
    if (!isNil(c) && !isUrlCodePoint(c) && !isChar(c, '%')) {
      sm.validationError = true;
    }

    // 3-2 If c is U+0025 (%) and remaining does not start with two ASCII hex digits, validation error.
    if (isChar(c, '%') && !startsWithAsciiHexDigit(sm.input.slice(sm.pointer + 1))) {
      sm.validationError = true;
    }

    // 3-3 If c is not the EOF code point, UTF-8 percent encode c using the C0 control percent-encode set, and append the result to url’s path[0].
    if (!isNil(c)) {
      const currentPath0 = sm.url.path[0] || '';
      sm.url.path[0] = currentPath0 + percentEncode(c, isC0ControlPercentEncodeSet);
    }
  }
}
