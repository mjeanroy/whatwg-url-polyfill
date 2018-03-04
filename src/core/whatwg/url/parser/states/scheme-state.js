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
import {isNull} from '../../../../lang/is-null';
import {toLower} from '../../../../lang/to-lower';
import {isAsciiAlphaNumeric} from '../common/is-ascii-alpha-numeric';
import {isSpecialUrl} from '../common/is-special-url';
import {isSpecialScheme} from '../common/is-special-scheme';
import {isSpecialSchemeDefaultPort} from '../common/is-special-scheme-default-port';
import {FAILURE} from './failure';
import {
  CANNOT_BE_A_BASE_URL_PATH_STATE,
  NO_SCHEME_STATE,
  PATH_OR_AUTHORITY_STATE,
  SPECIAL_AUTHORITY_SLASHES_STATE,
  SPECIAL_RELATIVE_OR_AUTHORITY_STATE,
} from './states';

/**
 * Algorithm for the `scheme start state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#scheme-state
 */
export function schemeState(sm, c) {
  const isStateOverrideDefined = !isNull(sm.stateOverride);

  // 1- If c is an ASCII alphanumeric, U+002B (+), U+002D (-), or U+002E (.), append c, lowercased, to buffer.
  if (isAsciiAlphaNumeric(c) || isChar(c, '+') || isChar(c, '-') || isChar(c, '.')) {
    sm.buffer += toLower(c);
  }

  // 2- Otherwise, if c is U+003A (:), then:
  else if (c === ':') {
    // 2.1- If state override is given, then:
    if (isStateOverrideDefined) {
      // 2.1.1 If url’s scheme is a special scheme and buffer is not a special scheme, then return.
      if (isSpecialUrl(sm.url) && !isSpecialScheme(sm.buffer)) {
        return;
      }

      // 2.1.2 If url’s scheme is not a special scheme and buffer is a special scheme, then return.
      if (!isSpecialUrl(sm.url) && isSpecialScheme(sm.buffer)) {
        return;
      }

      // 2.1.3 If url includes credentials or has a non-null port, and buffer is "file", then return.
      if (((sm.url.username && sm.url.password) || (!isNull(sm.url.port))) && sm.buffer === 'file') {
        return;
      }

      // 2.1.4 If url’s scheme is "file" and its host is an empty host or null, then return.
      if (sm.url.scheme === 'file' && !sm.url.host) {
        return;
      }
    }

    // 2.2 Set url’s scheme to buffer.
    sm.url.scheme = sm.buffer;

    // 2.3 If state override is given, then:
    if (isStateOverrideDefined) {
      // 2.3.1 If url’s port is url’s scheme’s default port, then set url’s port to null.
      if (isSpecialSchemeDefaultPort(sm.url.scheme, sm.url.port)) {
        sm.url.port = null;
      }

      // 2.3.2 Return.
      return;
    }

    // 2.4 Set buffer to the empty string.
    sm.buffer = '';

    // 2.5 If url’s scheme is "file", then:
    if (sm.url.scheme === 'file') {
      // 2.5.1 If remaining does not start with "//", validation error.
      if (!isChar(sm.input.charAt(sm.pointer + 1), '/') || !isChar(sm.input.charAt(sm.pointer + 2), '/')) {
        sm.validationError = true;
      }

      // 2.5.2 Set state to file state.
      sm.state = 'file';
    }

    // 2.6 Otherwise, if url is special, base is non-null, and base’s scheme is equal to url’s scheme,
    // set state to special relative or authority state.
    else if (isSpecialUrl(sm.url) && !isNull(sm.base) && sm.base.scheme === sm.url.scheme) {
      sm.state = SPECIAL_RELATIVE_OR_AUTHORITY_STATE;
    }

    // 2.7 Otherwise, if url is special, set state to special authority slashes state.
    else if (isSpecialUrl(sm.url)) {
      sm.state = SPECIAL_AUTHORITY_SLASHES_STATE;
    }

    // 2.8 Otherwise, if remaining starts with an U+002F (/), set state to path or authority state
    // and increase pointer by one.
    else if (isChar(sm.input.charAt(sm.pointer + 1), '/')) {
      sm.state = PATH_OR_AUTHORITY_STATE;
      sm.pointer++;
    }

    // 2.9 Otherwise, set url’s cannot-be-a-base-URL flag, append an empty string to url’s path,
    // and set state to cannot-be-a-base-URL path state.
    else {
      sm.url.cannotBeABaseUrl = true;
      sm.url.path.push('');
      sm.state = CANNOT_BE_A_BASE_URL_PATH_STATE;
    }
  }

  // 3- Otherwise, if state override is not given, set buffer to the empty string,
  // state to no scheme state, and start over (from the first code point in input).
  else if (!isStateOverrideDefined) {
    sm.buffer = '';
    sm.state = NO_SCHEME_STATE;
    sm.pointer = -1;
  }

  // 4- Otherwise, validation error, return failure.
  else {
    sm.validationError = true;
    return FAILURE;
  }
}
