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
import {clone} from '../../../../lang/clone';
import {isNil} from '../../../../lang/is-nil';
import {isNull} from '../../../../lang/is-null';
import {startsWithWindowsDriveLetter} from '../common/starts-with-windows-drive-letter';
import {shortenUrlPath} from '../common/shorten-url-path';
import {FILE_SLASH_STATE, FRAGMENT_STATE, PATH_STATE, QUERY_STATE} from './states';

/**
 * Algorithm for the `file state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#file-state
 */
export function fileState(sm, c) {
  // 1- Set url’s scheme to "file".
  sm.url.scheme = 'file';

  // 2- If c is U+002F (/) or U+005C (\), then:
  if (isChar(c, '/') || isChar(c, '\\')) {
    // 2.1- If c is U+005C (\), validation error.
    if (isChar(c, '\\')) {
      sm.validationError = true;
    }

    // 2.2- Set state to file slash state.
    sm.state = FILE_SLASH_STATE;
  }

  // 3- Otherwise, if base is non-null and base’s scheme is "file", switch on c:
  else if (!isNull(sm.base) && sm.base.scheme === 'file') {
    // -> The EOF code point
    // 3.1- Set url’s host to base’s host, url’s path to a copy of base’s path, and url’s query to base’s query.
    if (isNil(c)) {
      sm.url.host = sm.base.host;
      sm.url.path = clone(sm.base.path);
      sm.url.query = sm.base.query;
    }

    // -> U+003F (?)
    // 3.2- Set url’s host to base’s host, url’s path to a copy of base’s path,
    // url’s query to the empty string, and state to query state.
    else if (isChar(c, '?')) {
      sm.url.host = sm.base.host;
      sm.url.path = clone(sm.base.path);
      sm.url.query = '';
      sm.state = QUERY_STATE;
    }

    // -> U+0023 (#)
    // 3.3- Set url’s host to base’s host, url’s path to a copy of base’s path, url’s query to base’s query,
    // url’s fragment to the empty string, and state to fragment state.
    else if (isChar(c, '#')) {
      sm.url.host = sm.base.host;
      sm.url.path = clone(sm.base.path);
      sm.url.query = sm.base.query;
      sm.url.fragment = '';
      sm.state = FRAGMENT_STATE;
    }

    // 3.4- Otherwise
    else {
      // 3.4.1- If the substring from pointer in input does not start with a Windows drive letter,
      // then set url’s host to base’s host, url’s path to a copy of base’s path, and then shorten url’s path.
      if (!startsWithWindowsDriveLetter(sm.input.slice(sm.pointer))) {
        sm.url.host = sm.base.host;
        sm.url.path = clone(sm.base.path);
        shortenUrlPath(sm.url);
      }

      // 3.4.2- Otherwise, validation error.
      else {
        sm.validationError = true;
      }

      // 3.4.3- Set state to path state, and decrease pointer by one.
      sm.state = PATH_STATE;
      sm.pointer--;
    }
  }

  // 4- Otherwise, set state to path state, and decrease pointer by one.
  else {
    sm.state = PATH_STATE;
    sm.pointer--;
  }
}
