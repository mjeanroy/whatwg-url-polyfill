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

import {isChar} from '../../../../lang/is-char';
import {isNil} from '../../../../lang/is-nil';
import {some} from '../../../../lang/some';

/**
 * A forbidden host code point is U+0000 NULL, U+0009 TAB, U+000A LF, U+000D CR, U+0020 SPACE,
 * U+0023 (#), U+0025 (%), U+002F (/), U+003A (:), U+003F (?),
 * U+0040 (@), U+005B ([), U+005C (\), or U+005D (]).
 *
 * @type {Array<Number>}
 * @const
 * @see https://url.spec.whatwg.org/#forbidden-host-code-point
 */
const FORBIDDEN_CODE_POINTS = [
  0x0000, 0x0009, 0x000A, 0X000D, 0x0020,
  0x0023, 0x0025, 0x002F, 0x003A, 0x003F,
  0x0040, 0x005B, 0x005C, 0x005D,
];

/**
 * Check if given code point is a forbidden host code point.
 *
 * @param {string|number} c The character (or code point).
 * @return {boolean} `true` if `c` is a forbidden host code point, `false` otherwise.
 * @see https://url.spec.whatwg.org/#forbidden-host-code-point
 */
export function isForbiddenHostCodePoint(c) {
  if (isNil(c)) {
    return false;
  }

  return some(FORBIDDEN_CODE_POINTS, (x) => isChar(c, x));
}
