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
import {isSpecialUrl} from '../common/is-special-url';
import {FRAGMENT_STATE, PATH_STATE, QUERY_STATE} from './states';

/**
 * Algorithm for the `path start state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#relative-slash-state
 */
export function pathStartState(sm, c) {
  // 1- If url is special, then:
  if (isSpecialUrl(sm.url)) {
    // 1-1 If c is U+005C (\), validation error.
    if (isChar(c, '\\')) {
      sm.validationError = true;
    }

    // 1-2 Set state to path state.
    sm.state = PATH_STATE;

    // 1-3 If c is neither U+002F (/) nor U+005C (\), then decrease pointer by one.
    if (!isChar(c, '/') && !isChar(c, '\\')) {
      sm.pointer--;
    }
  }

  // 2- Otherwise, if state override is not given and c is U+003F (?),
  // set url’s query to the empty string and state to query state.
  else if (isNull(sm.stateOverride) && isChar(c, '?')) {
    sm.url.query = '';
    sm.state = QUERY_STATE;
  }

  // 3- Otherwise, if state override is not given and c is U+0023 (#),
  // set url’s fragment to the empty string and state to fragment state.
  else if (isNull(sm.stateOverride) && isChar(c, '#')) {
    sm.url.fragment = '';
    sm.state = FRAGMENT_STATE;
  }

  // 4- Otherwise, if c is not the EOF code point:
  else if (!isNil(c)) {
    // 4-1 Set state to path state.
    sm.state = PATH_STATE;

    // 4-2 If c is not U+002F (/), then decrease pointer by one.
    if (!isChar(c, '/')) {
      sm.pointer--;
    }
  }
}
