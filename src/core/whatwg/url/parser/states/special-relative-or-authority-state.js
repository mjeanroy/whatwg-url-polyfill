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
import {RELATIVE_STATE, SPECIAL_AUTHORITY_IGNORE_SLAHES_STATE} from './states';

/**
 * Implement `special relative or authority state` parsing.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The character being parsed.
 * @return {void}
 * @see https://url.spec.whatwg.org/#special-relative-or-authority-state
 */
export function specialRelativeOrAuthorityState(sm, c) {
  // 1- If c is U+002F (/) and remaining starts with U+002F (/), then set state
  // to special authority ignore slashes state and increase pointer by one.
  if (isChar(c, '/') && isChar(sm.input[sm.pointer + 1], '/')) {
    sm.state = SPECIAL_AUTHORITY_IGNORE_SLAHES_STATE;
    sm.pointer++;
  }

  // 2- Otherwise, validation error, set state to relative state and decrease pointer by one.
  else {
    sm.validationError = true;
    sm.state = RELATIVE_STATE;
    sm.pointer--;
  }
}
