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

import {isNil} from '../../../../lang/is-nil';
import {unicodeToAscii} from '../../../../tr46/unicode-to-ascii';
import {FAILURE} from '../common/failure';

/**
 * Parse host input.
 *
 * @param {string} domain The domain input.
 * @param {boolean} beStrict The optional `strict` flag, default is false.
 * @return {string} The ascii output.
 * @see https://url.spec.whatwg.org/#concept-domain-to-ascii
 */
export function domainToAscii(domain, beStrict = false) {
  // 1- If beStrict is not given, set it to false.
  // Nothing to do here.

  // 2- Let result be the result of running Unicode ToASCII with domain_name set to domain,
  // UseSTD3ASCIIRules set to beStrict, CheckHyphens set to false, CheckBidi set to true,
  // CheckJoiners set to true, processing_option set to Nontransitional_Processing, and VerifyDnsLength set to beStrict.
  const result = unicodeToAscii(domain, {
    useSTD3ASCIIRules: beStrict,
    verifyDNSLength: beStrict,

    checkBidi: true,
    checkHyphens: false,
    checkJoiners: true,
    processingOption: 'nontransitional',
  });

  // 3- If result is a failure value, validation error, return failure.
  if (isNil(result)) {
    return FAILURE;
  }

  // 4- Return result.
  return result;
}
