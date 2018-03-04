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

import {isNull} from '../../../../lang/is-null';
import {toLower} from '../../../../lang/to-lower';
import {isAsciiAlpha} from '../common/is-ascii-alpha';
import {FAILURE} from './failure';
import {NO_SCHEME_STATE, SCHEME_STATE} from './states';

/**
 * Algorithm for the `scheme start state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#scheme-start-state
 */
export function schemeStartState(sm, c) {
  // 1- If c is an ASCII alpha, append c, lowercased, to buffer, and set state to scheme state.
  if (isAsciiAlpha(c)) {
    sm.buffer += toLower(c);
    sm.state = SCHEME_STATE;
  }

  // 2- Otherwise, if state override is not given, set state to no scheme state, and decrease pointer by one.
  else if (isNull(sm.stateOverride)) {
    sm.state = NO_SCHEME_STATE;
    sm.pointer--;
  }

  // 3- Otherwise, validation error, return failure.
  else {
    sm.validationError = true;
    return FAILURE;
  }
}
