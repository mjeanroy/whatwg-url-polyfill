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
import {isNumber} from '../../../../lang/is-number';
import {utf8DecodeWithoutBom} from '../../../../utf8/utf8-decode-without-bom';
import {containsForbiddenHostCodePoint} from '../common/contains-forbidden-host-code-point';
import {FAILURE} from '../common/failure';
import {percentDecode} from '../encoding/percent-decode';
import {domainToAscii} from './domain-to-ascii';
import {ipv4Parser} from './ipv4-parser';
import {ipv6Parser} from './ipv6-parser';
import {opaqueHostParser} from './opaque-host-parser';

/**
 * Parse host input.
 *
 * @param {string} input The host input string.
 * @param {boolean} isSpecial A flag, indicating if associated URL is special.
 * @return {string} The host.
 * @see https://url.spec.whatwg.org/#host-parsing
 */
export function hostParser(input, isSpecial) {
  // 1- If input starts with U+005B ([), then:
  if (isChar(input[0], '[')) {
    // 1-1 If input does not end with U+005D (]), validation error, return failure.
    if (!isChar(input[input.length - 1], ']')) {
      return FAILURE;
    }

    // 1-2 Return the result of IPv6 parsing input with its leading U+005B ([) and trailing U+005D (]) removed.
    return ipv6Parser(input.slice(1, input.length - 1));
  }

  // 2- If isSpecial is false, then return the result of opaque-host parsing input.
  if (!isSpecial) {
    return opaqueHostParser(input);
  }

  // 3- Let domain be the result of running UTF-8 decode without BOM on the string percent decoding of input.
  const domain = utf8DecodeWithoutBom(percentDecode(input));

  // 4- Let asciiDomain be the result of running domain to ASCII on domain.
  const asciiDomain = domainToAscii(domain);

  // 5- If asciiDomain is failure, validation error, return failure.
  if (isNil(asciiDomain)) {
    return FAILURE;
  }

  // 6- If asciiDomain contains a forbidden host code point, validation error, return failure.
  if (containsForbiddenHostCodePoint(asciiDomain)) {
    return FAILURE;
  }

  // 7- Let ipv4Host be the result of IPv4 parsing asciiDomain.
  const ipv4Host = ipv4Parser(asciiDomain);

  // 8- If ipv4Host is an IPv4 address or failure, return ipv4Host.
  if (ipv4Host === FAILURE || isNumber(ipv4Host)) {
    return ipv4Host;
  }

  // 9- Return asciiDomain.
  return asciiDomain;
}
