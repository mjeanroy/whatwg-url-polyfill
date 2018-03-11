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
import {isFragmentPercentEncodeSet} from '../common/is-fragment-percent-encode-set';
import {isSpecialUrl} from '../common/is-special-url';
import {percentEncode} from '../encoding/percent-encode';
import {FAILURE} from '../common/failure';
import {HOST_STATE} from './states';

/**
 * Implement `authority state` parsing.
 *
 * @param {StateMachine} sm The state machinge.
 * @param {string} c The character being parsed.
 * @return {void}
 * @see https://url.spec.whatwg.org/#authority-state
 */
export function authorityState(sm, c) {
  // 1- If c is U+0040 (@), then:
  if (isChar(c, '@')) {
    // 1-1 Validation error.
    sm.validationError = true;

    // 1-2 If the @ flag is set, prepend "%40" to buffer.
    if (sm.atFlag) {
      sm.buffer += '%40';
    }

    // 1-3 Set the @ flag.
    sm.atFlag = true;

    // 1-4 For each codePoint in buffer:
    for (let i = 0, size = sm.buffer.length; i < size; ++i) {
      const character = sm.buffer.charAt(i);

      // 1-4-1 If codePoint is U+003A (:) and passwordTokenSeenFlag is unset,
      // then set passwordTokenSeenFlag and continue.
      if (isChar(character, ':') && !sm.passwordTokenSeenFlag) {
        sm.passwordTokenSeenFlag = true;
        continue;
      }

      // 1-4-2 Let encodedCodePoints be the result of running UTF-8 percent encode
      // codePoint using the userinfo percent-encode set.
      const encodedCodePoints = percentEncode(character, isUserInfoPercentEncodeSet);

      // 1-4-3 If passwordTokenSeenFlag is set, then append encodedCodePoints to url’s password.
      if (sm.passwordTokenSeenFlag) {
        sm.url.password += encodedCodePoints;
      }

      // 1-4-4 Otherwise, append encodedCodePoints to url’s username.
      else {
        sm.url.username += encodedCodePoints;
      }
    }

    // 1-5 Set buffer to the empty string.
    sm.buffer = '';
  }

  // 2- Otherwise, if one of the following is true
  // - c is the EOF code point, U+002F (/), U+003F (?), or U+0023 (#)
  // - url is special and c is U+005C (\)
  else if (isNil(c) || isChar(c, '/') || isChar(c, '?') || isChar(c, '#') || (isSpecialUrl(sm.url) && isChar(c, '\\'))) {
    // 2-1 If @ flag is set and buffer is the empty string, validation error, return failure.
    if (sm.atFlag && sm.buffer === '') {
      sm.validationError = true;
      return FAILURE;
    }

    // 2-2 Decrease pointer by the number of code points in buffer plus one,
    // set buffer to the empty string, and set state to host state.
    sm.pointer -= (sm.buffer.length + 1);
    sm.buffer = '';
    sm.state = HOST_STATE;
  }

  // 3- Otherwise, append c to buffer.
  else {
    sm.buffer += c;
  }
}

/**
 * Check if the given character is part of the path percent encode set.
 *
 * @param {number} c The code point to check.
 * @return {boolean} `true` if code point is part of the path percent encode set, `false` otherwise.
 * @see https://url.spec.whatwg.org/#path-percent-encode-set
 */
function isPathPercentEncodeSet(c) {
  // The path percent-encode set is the fragment percent-encode set and U+0023 (#),
  // U+003F (?), U+007B ({), and U+007D (}).
  return isFragmentPercentEncodeSet(c) ||
    isChar(c, '#') ||
    isChar(c, '?') ||
    isChar(c, '{') ||
    isChar(c, '}');
}

/**
 * Check if the given character is part of the user-info percent encode set.
 *
 * @param {number} c The code point to check.
 * @return {boolean} `true` if code point is part of the user-info percent encode set, `false` otherwise.
 * @see https://url.spec.whatwg.org/#userinfo-percent-encode-set
 */
function isUserInfoPercentEncodeSet(c) {
  // The userinfo percent-encode set is the path percent-encode set and U+002F (/), U+003A (:),
  // U+003B (;), U+003D (=), U+0040 (@), U+005B ([), U+005C (\), U+005D (]), U+005E (^), and U+007C (|).
  return isPathPercentEncodeSet(c) ||
    isChar(c, '/') ||
    isChar(c, ':') ||
    isChar(c, ';') ||
    isChar(c, '=') ||
    isChar(c, '@') ||
    isChar(c, '[') ||
    isChar(c, '\\') ||
    isChar(c, ']') ||
    isChar(c, '^') ||
    isChar(c, '|');
}
