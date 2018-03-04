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
import {clone} from '../../../../lang/clone';
import {size} from '../../../../lang/size';
import {isSpecialUrl} from '../common/is-special-url';
import {FRAGMENT_STATE, PATH_STATE, QUERY_STATE, RELATIVE_SLASH_STATE} from './states';

/**
 * Algorithm for the `relative state` step.
 *
 * @param {StateMachine} sm The state machine.
 * @param {string} c The current parsed character.
 * @return {void|FAILURE} Nothing, or `FAILURE` in case of error.
 * @see https://url.spec.whatwg.org/#relative-state
 */
export function relativeState(sm, c) {
  // 1- Set url’s scheme to base’s scheme, and then, switching on c:
  sm.url.scheme = sm.base.scheme;

  // -> The EOF code point
  // Set url’s username to base’s username, url’s password to base’s password,
  // url’s host to base’s host, url’s port to base’s port, url’s path to a copy
  // of base’s path, and url’s query to base’s query.
  if (isNil(c)) {
    copyUrlFromBase(sm);

    sm.url.query = sm.base.query;
  }

  // -> U+002F (/)
  // Set state to relative slash state.
  else if (isChar(c, '/')) {
    sm.state = RELATIVE_SLASH_STATE;
  }

  // -> U+003F (?)
  // Set url’s username to base’s username, url’s password to base’s password,
  // url’s host to base’s host, url’s port to base’s port, url’s path to a copy of base’s path,
  // url’s query to the empty string, and state to query state.
  else if (isChar(c, '?')) {
    copyUrlFromBase(sm);

    sm.url.query = '';
    sm.state = QUERY_STATE;
  }

  // -> U+0023 (#)
  // Set url’s username to base’s username, url’s password to base’s password,
  // url’s host to base’s host, url’s port to base’s port, url’s path to a copy of base’s path,
  // url’s query to base’s query, url’s fragment to the empty string, and state to fragment state.
  else if (isChar(c, '#')) {
    copyUrlFromBase(sm);

    sm.url.query = sm.base.query;
    sm.url.fragment = '';
    sm.state = FRAGMENT_STATE;
  }

  // -> Otherwise
  else {
    // If url is special and c is U+005C (\), validation error, set state to relative slash state.
    if (isSpecialUrl(sm.url) && isChar(c, '\\')) {
      sm.validationError = true;
      sm.state = RELATIVE_SLASH_STATE;
    }

    // Otherwise, run these steps:
    // - Set url’s username to base’s username, url’s password to base’s password, url’s host to base’s host,
    //   url’s port to base’s port, url’s path to a copy of base’s path, and then remove url’s path’s
    //   last item, if any.
    // - Set state to path state, and decrease pointer by one.
    else {
      copyUrlFromBase(sm);

      const countPath = size(sm.url.path);
      if (countPath > 0) {
        sm.url.path = sm.url.path.slice(0, countPath - 1);
      }

      sm.state = PATH_STATE;
      sm.pointer--;
    }
  }
}

/**
 * Copy main elements (everything except scheme, query and fragment) from base URL to URL.
 *
 * @param {StateMachine} sm The state machine.
 * @return {void}
 */
function copyUrlFromBase(sm) {
  sm.url.username = sm.base.username;
  sm.url.password = sm.base.password;
  sm.url.host = sm.base.host;
  sm.url.port = sm.base.port;
  sm.url.path = clone(sm.base.path);
}
