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
import {isNull} from '../../../../lang/is-null';
import {isAsciiDigit} from '../common/is-ascii-digit';
import {isAsciiHexDigit} from '../common/is-ascii-hex-digit';
import {FAILURE} from '../common/failure';

/**
 * Parse IPv6 input.
 *
 * @param {string} input Input string.
 * @return {Array<Number>} The IPv6 output.
 * @see https://url.spec.whatwg.org/#concept-ipv6-parser
 */
export function ipv6Parser(input) {
  // 1- Let address be a new IPv6 address whose IPv6 pieces are all 0.
  // An IPv6 address is a 128-bit unsigned integer that identifies a network address.
  // For the purposes of this standard it is represented as a list of eight 16-bit unsigned integers,
  // also known as IPv6 pieces. [RFC4291]
  // See: https://url.spec.whatwg.org/#concept-ipv6
  const address = [0, 0, 0, 0, 0, 0, 0, 0];

  // 2- Let pieceIndex be 0.
  let pieceIndex = 0;

  // 3- Let compress be null.
  let compress = null;

  // 4- Let pointer be a pointer into input, initially 0 (pointing to the first code point).
  let pointer = 0;

  // 5- If c is U+003A (:), then:
  if (isChar(input[pointer], ':')) {
    // 5-1 If remaining does not start with U+003A (:), validation error, return failure.
    if (!isChar(input[pointer + 1], ':')) {
      return FAILURE;
    }

    // 5-2 Increase pointer by 2.
    pointer += 2;

    // 5-3 Increase pieceIndex by 1 and then set compress to pieceIndex.
    pieceIndex++;
    compress = pieceIndex;
  }

  // 6- While c is not the EOF code point:
  while (pointer < input.length) {
    // 6-1 If pieceIndex is 8, validation error, return failure.
    if (pieceIndex === 8) {
      return FAILURE;
    }

    // 6-2 If c is U+003A (:), then:
    if (isChar(input[pointer], ':')) {
      // 6-2-1 If compress is non-null, validation error, return failure.
      if (!isNull(compress)) {
        return FAILURE;
      }

      // 6-2-2 Increase pointer and pieceIndex by 1, set compress to pieceIndex, and then continue.
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }

    // 6-3 Let value and length be 0.
    let value = 0;
    let length = 0;

    // 6-4 While length is less than 4 and c is an ASCII hex digit,
    // set value to value × 0x10 + c interpreted as hexadecimal number,
    // and increase pointer and length by 1.
    while (length < 4 && isAsciiHexDigit(input[pointer])) {
      value = value * 0x10 + parseInt(input[pointer], 16);
      pointer++;
      length++;
    }

    // 6-5 If c is U+002E (.), then:
    if (isChar(input[pointer], '.')) {
      // 6-5-1 If length is 0, validation error, return failure.
      if (length === 0) {
        return FAILURE;
      }

      // 6-5-2 Decrease pointer by length.
      pointer -= length;

      // 6-5-3 If pieceIndex is greater than 6, validation error, return failure.
      if (pieceIndex > 6) {
        return FAILURE;
      }

      // 6-5-4 Let numbersSeen be 0.
      let numbersSeen = 0;

      // 6-5-5 While c is not the EOF code point:
      while (!isNil(input[pointer])) {
        // 6-5-5-1 Let ipv4Piece be null.
        let ipv4Piece = null;

        // 6-5-5-2 If numbersSeen is greater than 0, then:
        if (numbersSeen > 0) {
          // 6-5-5-2-1 If c is a U+002E (.) and numbersSeen is less than 4, then increase pointer by 1.
          if (isChar(input[pointer], '.') && numbersSeen < 4) {
            pointer++;
          }

          // 6-5-5-2-2 Otherwise, validation error, return failure.
          else {
            return FAILURE;
          }
        }

        // 6-5-5-3 If c is not an ASCII digit, validation error, return failure.
        if (!isAsciiDigit(input[pointer])) {
          return FAILURE;
        }

        // 6-5-5-4 While c is an ASCII digit:
        while (isAsciiDigit(input[pointer])) {
          // 6-5-5-4-1 Let number be c interpreted as decimal number.
          const number = parseInt(input[pointer], 10);

          // 6-5-5-4-2 If ipv4Piece is null, then set ipv4Piece to number.
          if (isNull(ipv4Piece)) {
            ipv4Piece = number;
          }

          // Otherwise, if ipv4Piece is 0, validation error, return failure.
          else if (ipv4Piece === 0) {
            return FAILURE;
          }

          // Otherwise, set ipv4Piece to ipv4Piece × 10 + number.
          else {
            ipv4Piece = ipv4Piece * 10 + number;
          }

          // 6-5-5-4-3 If ipv4Piece is greater than 255, validation error, return failure.
          if (ipv4Piece > 255) {
            return FAILURE;
          }

          // 6-5-5-4-4 Increase pointer by 1.
          pointer++;
        }

        // 6-5-5-5 Set address[pieceIndex] to address[pieceIndex] × 0x100 + ipv4Piece.
        address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;

        // 6-5-5-6 Increase numbersSeen by 1.
        numbersSeen++;

        // 6-5-5-7 If numbersSeen is 2 or 4, then increase pieceIndex by 1.
        if (numbersSeen === 2 || numbersSeen === 4) {
          pieceIndex++;
        }
      }

      // 6-5-6 If numbersSeen is not 4, validation error, return failure.
      if (numbersSeen !== 4) {
        return FAILURE;
      }

      // 6-5-7 Break.
      break;
    }

    // 6-6 Otherwise, if c is U+003A (:):
    else if (isChar(input[pointer], ':')) {
      // 6-6-1 Increase pointer by 1.
      pointer++;

      // 6-6-2 If c is the EOF code point, validation error, return failure.
      if (isNil(input[pointer])) {
        return FAILURE;
      }
    }

    // 6-7 Otherwise, if c is not the EOF code point, validation error, return failure.
    else if (!isNil(input[pointer])) {
      return FAILURE;
    }

    // 6-8 Set address[pieceIndex] to value.
    address[pieceIndex] = value;

    // 6-9 Increase pieceIndex by 1.
    pieceIndex++;
  }

  // 7- If compress is non-null, then:
  if (!isNull(compress)) {
    // 7-1 Let swaps be pieceIndex − compress.
    let swaps = pieceIndex - compress;

    // 7-2 Set pieceIndex to 7.
    pieceIndex = 7;

    // 7-3 While pieceIndex is not 0 and swaps is greater than 0, swap address[pieceIndex] with address[compress + swaps − 1],
    // and then decrease both pieceIndex and swaps by 1.
    while (pieceIndex !== 0 && swaps > 0) {
      swap(address, pieceIndex, compress + swaps - 1);
      pieceIndex--;
      swaps--;
    }
  }

  // 8- Otherwise, if compress is null and pieceIndex is not 8, validation error, return failure.
  else if (isNull(compress) && pieceIndex !== 8) {
    return FAILURE;
  }

  // 9- Return address.
  return address;
}

/**
 * Swap elements in an array.
 *
 * @param {Array<*>} array Input array.
 * @param {number} x First index.
 * @param {number} y Second index.
 * @return {void}
 */
function swap(array, x, y) {
  const tmp = array[x];
  array[x] = array[y];
  array[y] = tmp;
}
