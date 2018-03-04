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
import {isNormalizedWindowsDriveLetter} from '../common/is-normalized-windows-drive-letter';
import {startsWithWindowsDriveLetter} from '../common/starts-with-windows-drive-letter';
import {HOST_STATE, PATH_STATE} from './states';

/**
 * Algorithm for the `file slash state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#file-slash-state
 */
export function fileSlashState(sm, c) {
  // 1- If c is U+002F (/) or U+005C (\), then:
  if (isChar(c, '/') || isChar(c, '\\')) {
    // 1-1 If c is U+005C (\), validation error.
    if (isChar(c, '\\')) {
      sm.validationError = true;
    }

    // 1-2 Set state to file host state.
    sm.state = HOST_STATE;
  }

  // 2- Otherwise:
  else {
    // 2-1 If base is non-null, base’s scheme is "file", and the substring from pointer in input does not start with a Windows drive letter, then:
    if (!isNull(sm.base) && sm.base.scheme === 'file' && !startsWithWindowsDriveLetter(sm.input.slice(sm.pointer))) {
      // 2-1-1 If base’s path[0] is a normalized Windows drive letter, then append base’s path[0] to url’s path.
      if (isNormalizedWindowsDriveLetter(sm.base.path[0])) {
        sm.url.path.push(sm.base.path[0]);
      }

      // 2-1-2 Otherwise, set url’s host to base’s host.
      else {
        sm.url.host = sm.base.host;
      }
    }

    // 2-2 Set state to path state, and decrease pointer by one.
    sm.state = PATH_STATE;
    sm.pointer--;
  }
}
