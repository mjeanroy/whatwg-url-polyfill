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

import {every} from '../../../../lang/every';
import {last} from '../../../../lang/last';
import {size} from '../../../../lang/size';
import {startsWith} from '../../../../lang/starts-with';
import {isAsciiDigit} from '../common/is-ascii-digit';
import {isAsciiHexDigit} from '../common/is-ascii-hex-digit';
import {isAsciiOctalDigit} from '../common/is-ascii-octal-digit';
import {FAILURE} from '../common/failure';

/**
 * Parse IPv4 input.
 *
 * @param {string} input Input string.
 * @return {Array<Number>} The IPv4 output.
 * @see https://url.spec.whatwg.org/#concept-ipv4-parser
 */
export function ipv4Parser(input) {
  // 1- Let validationErrorFlag be unset.
  // Nothing to do here.

  // 2- Let parts be input split on U+002E (.).
  const parts = input.split('.');

  // 3- If the last item in parts is the empty string, then:
  if (last(parts) === '') {
    // 3-1 Set validationErrorFlag.
    // Nothing to do here.

    // 3-2 If parts has more than one item, then remove the last item from parts.
    if (parts.length > 1) {
      parts.pop();
    }
  }

  // 4- If parts has more than four items, return input.
  if (parts.length > 4) {
    return input;
  }

  // 5- Let numbers be the empty list.
  const numbers = [];

  // 6- For each part in parts:
  for (let i = 0, size = parts.length; i < size; ++i) {
    const part = parts[i];

    // 6-1 If part is the empty string, return input.
    if (part === '') {
      return input;
    }

    const n = ipv4NumberParser(part);
    if (n === FAILURE) {
      return input;
    }

    numbers.push(n);
  }

  // 7- If validationErrorFlag is set, validation error.
  // Nothing to do here.

  // 8- If any item in numbers is greater than 255, validation error.
  // Nothing to do here.

  // 9- If any but the last item in numbers is greater than 255, return failure.
  const nbNumbers = size(numbers);
  for (let i = 0, ln = nbNumbers - 1; i < ln; ++i) {
    if (numbers[i] > 255) {
      return FAILURE;
    }
  }

  // 10- the last item in numbers is greater than or equal to 256^(5 − the number of items in numbers), validation error, return failure.
  const lastItem = last(numbers);
  if (lastItem >= Math.pow(256, 5 - nbNumbers)) {
    return FAILURE;
  }

  // 11- Let ipv4 be the last item in numbers.
  let ipv4 = lastItem;

  // 12- Remove the last item from numbers.
  numbers.pop();

  // 13- Let counter be zero.
  let counter = 0;

  // 14- For each n in numbers:
  for (let k = 0, ln = numbers.length; k < ln; ++k) {
    const n = numbers[k];

    // 14-1 Increment ipv4 by n × 256^(3 − counter)
    ipv4 += n * Math.pow(256, 3 - counter);

    // 14-2 Increment counter by 1.
    counter++;
  }

  // 15- Return ipv4.
  return ipv4;
}

/**
 * Parse IPv4 number part.
 *
 * @param {string} input The part.
 * @return {Number} The parsed number.
 * @see https://url.spec.whatwg.org/#ipv4-number-parser
 */
function ipv4NumberParser(input) {
  // 1- Let R be 10.
  let r = 10;

  // 2- If input contains at least two code points and the first two code points are either "0x" or "0X", then:
  if (input.length >= 2 && (startsWith(input, '0x') || startsWith(input, '0X'))) {
    // 2-1 Set validationErrorFlag.
    // Nothing to do here.

    // 2-2 Remove the first two code points from input.
    input = input.slice(2);

    // 2-3 Set R to 16.
    r = 16;
  }

  // 3- Otherwise, if input contains at least two code points and the first code point is U+0030 (0), then:
  else if (input.length >= 2 && startsWith(input, '0')) {
    // 3-1 Set validationErrorFlag.
    // Nothing to do here.

    // 3-2 Remove the first code point from input.
    input = input.slice(1);

    // 3-3 Set R to 8.
    r = 8;
  }

  // 4- If input is the empty string, then return zero.
  if (input === '') {
    return 0;
  }

  // 5- If input contains a code point that is not a radix-R digit, then return failure.
  const predicate = r === 10 ? isAsciiDigit : (r === 8 ? isAsciiOctalDigit : isAsciiHexDigit);
  if (!every(input, (c) => predicate(c))) {
    return FAILURE;
  }

  // 6- Return the mathematical integer value that is represented by input in radix-R notation,
  // using ASCII hex digits for digits with values 0 through 15.
  return parseInt(input, r);
}
