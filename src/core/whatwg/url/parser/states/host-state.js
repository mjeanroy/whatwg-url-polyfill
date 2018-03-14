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
import {hostParser} from '../host/host-parser';
import {isSpecialUrl} from '../common/is-special-url';
import {FAILURE} from '../common/failure';
import {FILE_HOST_STATE, HOSTNAME_STATE, PATH_START_STATE, PORT_STATE} from './states';

/**
 * Algorithm for the `host state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#file-state
 */
export function hostState(sm, c) {
  // 1- If state override is given and url’s scheme is "file", then decrease pointer by one and set state to file host state.
  if (isNull(sm.stateOverride) && sm.url.scheme === 'file') {
    sm.pointer--;
    sm.state = FILE_HOST_STATE;
  }

  // 2- Otherwise, if c is U+003A (:) and the [] flag is unset, then:
  else if (isChar(c, ':') && !sm.arrFlag) {
    // 2-1 If buffer is the empty string, validation error, return failure.
    if (sm.buffer === '') {
      sm.validationError = true;
      return FAILURE;
    }

    // 2-2 Let host be the result of host parsing buffer with url is special.
    const host = hostParser(sm.buffer, isSpecialUrl(sm.url));

    // 2-3 If host is failure, then return failure.
    if (isNil(host)) {
      return FAILURE;
    }

    // 2-4 Set url’s host to host, buffer to the empty string, and state to port state.
    sm.url.host = host;
    sm.buffer = '';
    sm.state = PORT_STATE;

    // 2-5 If state override is given and state override is hostname state, then return.
    if (!isNull(sm.stateOverride) && sm.stateOverride === HOSTNAME_STATE) {
      return;
    }
  }

  // 3- Otherwise, if one of the following is true
  //  - c is the EOF code point, U+002F (/), U+003F (?), or U+0023 (#)
  //  - url is special and c is U+005C (\)
  else if ((isNil(c) || isChar(c, '/') || isChar(c, '?') || isChar(c, '#')) || (isSpecialUrl(sm.url) && isChar(c, '\\'))) {
    // 3-1 then decrease pointer by one, and then:
    sm.pointer--;

    // 3-2 If url is special and buffer is the empty string, validation error, return failure.
    if (isSpecialUrl(sm.url) && sm.buffer === '') {
      sm.validationError = true;
      return FAILURE;
    }

    // 3-3 Otherwise, if state override is given, buffer is the empty string,
    // and either url includes credentials or url’s port is non-null, validation error, return.
    else if (!isNull(sm.stateOverride) && sm.buffer === '' && (includeCredentials(sm.url) || !isNull(sm.url.port))) {
      sm.validationError = true;
      return;
    }

    // 3-4 Let host be the result of host parsing buffer with url is special.
    const host = hostParser(sm.buffer, isSpecialUrl(sm.url));

    // 3-5 If host is failure, then return failure.
    if (isNil(host)) {
      return FAILURE;
    }

    // 3-6 Set url’s host to host, buffer to the empty string, and state to path start state.
    sm.url.host = host;
    sm.buffer = '';
    sm.state = PATH_START_STATE;

    // 3-7 If state override is given, then return.
    if (!isNull(sm.stateOverride)) {
      return;
    }
  }

  // 4- Otherwise:
  else {
    // 4-1 If c is U+005B ([), then set the [] flag.
    if (isChar(c, '[')) {
      sm.arrFlag = true;
    }

    // 4-2 If c is U+005D (]), then unset the [] flag.
    if (isChar(c, ']')) {
      sm.arrFlag = false;
    }

    // 4-3 Append c to buffer.
    sm.buffer += c;
  }
}
