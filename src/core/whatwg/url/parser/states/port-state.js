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
import {isNull} from '../../../../lang/is-null';
import {isAsciiDigit} from '../common/is-ascii-digit';
import {isSpecialSchemeDefaultPort} from '../common/is-special-scheme-default-port';
import {isSpecialUrl} from '../common/is-special-url';
import {FAILURE} from '../common/failure';
import {PATH_START_STATE} from './states';

/**
 * Algorithm for the `port state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#port-state
 */
export function portState(sm, c) {
  // 1- If c is an ASCII digit, append c to buffer.
  if (isAsciiDigit(c)) {
    sm.buffer += c;
  }

  // 2- Otherwise, if one of the following is true
  //  -> c is the EOF code point, U+002F (/), U+003F (?), or U+0023 (#)
  //  -> url is special and c is U+005C (\)
  //  -> state override is given
  else if ((isNil(c) || isChar(c, '/') || isChar(c, '?') || isChar(c, '#')) || (isSpecialUrl(sm.url) && isChar(c, '\\')) || (!isNull(sm.stateOverride))) {
    // 2-1 If buffer is not the empty string, then:
    if (sm.buffer !== '') {
      // 2-1-1 Let port be the mathematical integer value that is represented by buffer in radix-10
      // using ASCII digits for digits with values 0 through 9.
      const port = parseInt(sm.buffer, 10);

      // 2-1-2 If port is greater than 2^(16 − 1), validation error, return failure.
      if (port > Math.pow(2, 16 - 1)) {
        sm.validationError = true;
        return FAILURE;
      }

      // 2-1-3 Set url’s port to null, if port is url’s scheme’s default port, and to port otherwise.
      if (isSpecialSchemeDefaultPort(sm.url.scheme, port)) {
        sm.url.port = null;
      } else {
        sm.url.port = port;
      }

      // 2-1-4 Set buffer to the empty string.
      sm.buffer = '';
    }

    // 2-2 If state override is given, then return.
    if (!isNull(sm.stateOverride)) {
      return;
    }

    // 2-3 Set state to path start state, and decrease pointer by one.
    sm.state = PATH_START_STATE;
    sm.pointer--;
  }

  // 3- Otherwise, validation error, return failure.
  else {
    sm.validationError = true;
    return FAILURE;
  }
}
