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
import {some} from '../../../../lang/some';
import {toCodePoint} from '../../../../lang/to-code-point';
import {isAsciiAlphaNumeric} from './is-ascii-alpha-numeric';

/**
 * Check if given character is an URL code point.
 *
 * @param {string} c The character.
 * @return {boolean} `true` if `c` is an URL code point, `false` otherwise.
 * @see https://url.spec.whatwg.org/#url-code-points
 */
export function isUrlCodePoint(c) {
  // The URL code points are ASCII alphanumeric, U+0021 (!), U+0024 ($), U+0026 (&), U+0027 ('),
  // U+0028 LEFT PARENTHESIS, U+0029 RIGHT PARENTHESIS, U+002A (*), U+002B (+), U+002C (,),
  // U+002D (-), U+002E (.), U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+003F (?), U+0040 (@), U+005F (_), U+007E (~),
  // and code points in the range U+00A0 to U+10FFFD, inclusive, excluding surrogates and noncharacters.
  return isAsciiAlphaNumeric(c) || isSimpleUrlCharacter(c) || isInUrlCodePointRange(c);
}

/**
 * The exhaustive list of all "simple" URL characters that should be checked.
 * Constains exactly (as specified by the RFC):
 * ```
 *   U+0021 (!), U+0024 ($), U+0026 (&), U+0027 ('), U+0028 LEFT PARENTHESIS, U+0029 RIGHT PARENTHESIS, U+002A (*), U+002B (+),
 *   U+002C (,), U+002D (-), U+002E (.), U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+003F (?), U+0040 (@), U+005F (_), U+007E (~)
 * ```
 *
 * @const
 * @type {Array<String}
 * @see https://url.spec.whatwg.org/#url-code-points
 */
const SIMPLE_URL_CHARACTERS = [
  '!', '$', '&', `'`, '(', ')', '*', '+',
  ',', '-', '.', '/', ':', ';', '=', '?', '@', '_', '~',
];

/**
 * Check if given character is included in the "simple characters whitelist".
 *
 * @param {string} c The character.
 * @return {boolean} `true` if the character is an URL character, `false` otherwise.
 */
function isSimpleUrlCharacter(c) {
  return some(SIMPLE_URL_CHARACTERS, (x) => isChar(c, x));
}

/**
 * Check if the character is in the range of special URL code points.
 *
 * @param {string} c The character.
 * @return {boolean} `true` if the character is in the range of "special" URL code points, `false` otherwise.
 * @see https://url.spec.whatwg.org/#url-code-points
 */
function isInUrlCodePointRange(c) {
  const codePoint = toCodePoint(c);
  return isInRange(codePoint, 0x00A0, 0x10FFFD) && !isSurrogate(codePoint) && !isNonCharacter(codePoint);
}

/**
 * Check if given code point is a surrogate code point.
 *
 * @param {number} codePoint The given code point.
 * @return {boolean} `true` if the code point is a surrogate code point, `false` otherwise.
 * @see https://infra.spec.whatwg.org/#surrogate
 */
function isSurrogate(codePoint) {
  // A surrogate is a code point that is in the range U+D800 to U+DFFF, inclusive.
  return isInRange(codePoint, 0xD800, 0xDFFF);
}

/**
 * The exhaustive list of all non-characters code point that should
 * be checked.
 *
 * This whitelist contains exactly:
 * ```
 *   U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF, U+3FFFE, U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE,
 *   U+5FFFF, U+6FFFE, U+6FFFF, U+7FFFE, U+7FFFF, U+8FFFE, U+8FFFF, U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF,
 *   U+BFFFE, U+BFFFF, U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF, U+FFFFE, U+FFFFF, U+10FFFE, U+10FFFF
 * ```
 *
 * @const
 * @type {Array<Number>}
 * @see https://infra.spec.whatwg.org/#noncharacter
 */
const NON_CHARACTERS_CODE_POINT = [
  0xFFFE, 0xFFFF, 0x1FFFE, 0x1FFFF, 0x2FFFE, 0x2FFFF, 0x3FFFE, 0x3FFFF, 0x4FFFE, 0x4FFFF, 0x5FFFE,
  0x5FFFF, 0x6FFFE, 0x6FFFF, 0x7FFFE, 0x7FFFF, 0x8FFFE, 0x8FFFF, 0x9FFFE, 0x9FFFF, 0xAFFFE, 0xAFFFF,
  0xBFFFE, 0xBFFFF, 0xCFFFE, 0xCFFFF, 0xDFFFE, 0xDFFFF, 0xEFFFE, 0xEFFFF, 0xFFFFE, 0xFFFFF, 0x10FFFE, 0x10FFFF,
];

/**
 * Check if given code point is a non-character code point.
 *
 * @param {number} codePoint The given code point.
 * @return {boolean} `true` if the code point is a non-character code point, `false` otherwise.
 * @see https://infra.spec.whatwg.org/#noncharacter
 */
function isNonCharacter(codePoint) {
  // A noncharacter is a code point that is in the range U+FDD0 to U+FDEF, inclusive,
  if (isInRange(codePoint, 0xFDD0, 0xFDEF)) {
    return true;
  }

  // or U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF, U+3FFFE, U+3FFFF, U+4FFFE, U+4FFFF,
  // U+5FFFE, U+5FFFF, U+6FFFE, U+6FFFF, U+7FFFE, U+7FFFF, U+8FFFE, U+8FFFF, U+9FFFE, U+9FFFF, U+AFFFE,
  // U+AFFFF, U+BFFFE, U+BFFFF, U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF, U+FFFFE, U+FFFFF, U+10FFFE, or U+10FFFF.
  return some(NON_CHARACTERS_CODE_POINT, (x) => isChar(c, x));
}

/**
 * Check if a code point value is in given range (inclusive).
 *
 * @param {number} codePoint Code point to check.
 * @param {number} lowerBound The lower-bound (inclusive).
 * @param {number} upperBound The upper-bound (inclusive).
 * @return {boolean} `true` if `lowerBound >= codePoint <= upperBound`, `false` otherwise.
 */
function isInRange(codePoint, lowerBound, upperBound) {
  return codePoint >= lowerBound && codePoint <= upperBound;
}
