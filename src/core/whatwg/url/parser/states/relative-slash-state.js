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
import {isSpecialUrl} from '../common/is-special-url';
import {AUTHORITY_STATE, PATH_STATE, SPECIAL_AUTHORITY_IGNORE_SLAHES_STATE} from './states';

/**
 * Algorithm for the `relative slash state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#relative-slash-state
 */
export function relativeSlashState(sm, c) {
  // 1- If url is special and c is U+002F (/) or U+005C (\), then:
  if (isSpecialUrl(sm.url) && (isChar(c, '/') || isChar(c, '\\'))) {
    // 1-1 If c is U+005C (\), validation error.
    if (isChar(c, '\\')) {
      sm.validationError = true;
    }

    // 1-2 Set state to special authority ignore slashes state.
    sm.state = SPECIAL_AUTHORITY_IGNORE_SLAHES_STATE;
  }

  // 2- Otherwise, if c is U+002F (/), then set state to authority state.
  else if (isChar(c, '/')) {
    sm.state = AUTHORITY_STATE;
  }

  // 3- Otherwise, set url’s username to base’s username, url’s password to base’s password,
  // url’s host to base’s host, url’s port to base’s port, state to path state,
  // and then, decrease pointer by one.
  else {
    sm.url.username = sm.base.username;
    sm.url.password = sm.base.password;
    sm.url.host = sm.base.host;
    sm.url.port = sm.base.port;
    sm.state = PATH_STATE;
    sm.pointer--;
  }
}
