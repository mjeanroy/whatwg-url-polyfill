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
import {AUTHORITY_STATE} from './states';

/**
 * Implement `special authority ignore slashes state` parsing.
 *
 * @param {StateMachine} sm The state machinge.
 * @param {string} c The character being parsed.
 * @return {void}
 * @see https://url.spec.whatwg.org/#special-authority-ignore-slashes-state
 */
export function specialAuthorityIgnoreSlashesState(sm, c) {
  // 1- If c is neither U+002F (/) nor U+005C (\), then set state to authority state
  // and decrease pointer by one.
  if (!isChar(c, '/') && !isChar(c, '\\')) {
    sm.state = AUTHORITY_STATE;
    sm.pointer--;
  }

  // 2- Otherwise, validation error.
  else {
    sm.validationError = true;
  }
}
