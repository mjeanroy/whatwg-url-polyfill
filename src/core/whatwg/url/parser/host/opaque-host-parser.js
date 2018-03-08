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

import {some} from '../../../../lang/some';
import {isC0ControlPercentEncodeSet} from '../common/is-c0-control-percent-encode-set';
import {isForbiddenHostCodePoint} from '../common/is-forbidden-host-code-point';
import {percentEncode} from '../common/percent-encode';
import {FAILURE} from '../common/failure';

/**
 * Process input using the `opaque host parser` algorithm.
 *
 * @param {string} input The input string.
 * @return {string} The output string.
 * @see https://url.spec.whatwg.org/#concept-opaque-host-parser
 */
export function opaqueHostParser(input) {
  // 1- If input contains a forbidden host code point excluding U+0025 (%), validation error, return failure.
  if (some(input, (x) => isForbiddenHostCodePoint(x))) {
    return FAILURE;
  }

  // 2- Let output be the empty string.
  let output = '';

  // 3- For each code point in input, UTF-8 percent encode it using the C0 control percent-encode set,
  // and append the result to output.
  for (let i = 0, size = input.length; i < size; ++i) {
    const codePoint = input[i];
    const percentEncoded = percentEncode(codePoint, isC0ControlPercentEncodeSet);
    output += percentEncoded;
  }
  // 4- Return output.
  return output;
}
