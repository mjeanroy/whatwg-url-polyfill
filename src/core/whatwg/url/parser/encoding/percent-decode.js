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

import {fromCodePoint} from '../../../../lang/from-code-point';
import {isChar} from '../../../../lang/is-char';
import {isAsciiHexDigit} from '../common/is-ascii-hex-digit';

/**
 * Percent decode given input string.
 *
 * @param {string} input The input string.
 * @return {string} The decoded output string.
 */
export function percentDecode(input) {
  // 1- Let output be an empty byte sequence.
  let output = '';

  // 2- For each byte byte in input:
  for (let i = 0; i < input.length; ++i) {
    const c = input[i];
    const isPercent = isChar(c, '%');

    // 2-1 If byte is not 0x25 (%), then append byte to output.
    if (!isPercent) {
      output += c;
    }

    // 2-2 Otherwise, if byte is 0x25 (%) and the next two bytes after byte in input are not
    // in the ranges 0x30 (0) to 0x39 (9), 0x41 (A) to 0x46 (F), and 0x61 (a) to 0x66 (f), all inclusive, append byte to output.
    else if (isPercent && !isAsciiHexDigit(input[i + 1]) || !isAsciiHexDigit(input[i + 2])) {
      output += c;
    }

    // 2-3 Otherwise:
    else {
      // 2-3-1 Let bytePoint be the two bytes after byte in input, decoded, and then interpreted as hexadecimal number.
      // 2-3-2 Append a byte whose value is bytePoint to output.
      output += fromCodePoint(parseInt(input.slice(i + 1, i + 3), 16));

      // 2-3-3 Skip the next two bytes in input.
      i += 2;
    }
  }

  // 3- Return output.
  return output;
}
