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
import {clone} from '../../../../lang/clone';
import {FAILURE} from '../common/failure';
import {FILE_STATE, FRAGMENT_STATE, RELATIVE_STATE} from './states';

/**
 * Algorithm for the `no scheme state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#no-scheme-state
 */
export function noSchemeState(sm, c) {
  // 1- If base is null, or base’s cannot-be-a-base-URL flag is set and c is not U+0023 (#),
  // validation error, return failure.
  if (isNull(sm.base) || (sm.base.cannotBeABaseUrl && !isChar(c, '#'))) {
    sm.validationError = true;
    return FAILURE;
  }

  // 2- Otherwise, if base’s cannot-be-a-base-URL flag is set and c is U+0023 (#), set url’s scheme to base’s scheme,
  // url’s path to a copy of base’s path, url’s query to base’s query, url’s fragment to the empty string,
  // set url’s cannot-be-a-base-URL flag, and set state to fragment state.
  if (sm.base.cannotBeABaseUrl && isChar(c, '#')) {
    sm.url.scheme = sm.base.scheme;
    sm.url.path = clone(sm.base.path);
    sm.url.query = sm.base.query;
    sm.url.fragment = '';
    sm.url.cannotBeABaseUrl = true;
    sm.state = FRAGMENT_STATE;
  }

  // 3- Otherwise, if base’s scheme is not "file", set state to relative state and decrease pointer by one.
  else if (sm.base.scheme !== 'file') {
    sm.state = RELATIVE_STATE;
    sm.pointer--;
  }

  // 4- Otherwise, set state to file state and decrease pointer by one.
  else {
    sm.state = FILE_STATE;
    sm.pointer--;
  }
}
