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

import _forEach from 'lodash.foreach';
import {percentEncode} from 'src/core/whatwg/url/parser/common/percent-encode';

describe('percentEncode', () => {
  // Map of percent-encoded chars
  // see: https://en.wikipedia.org/wiki/Percent-encoding
  const INPUTS = {
    '!': '%21',
    '#': '%23',
    '$': '%24',
    '&': '%26',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A',
    '+': '%2B',
    ',': '%2C',
    '/': '%2F',
    ':': '%3A',
    ';': '%3B',
    '=': '%3D',
    '?': '%3F',
    '@': '%40',
    '[': '%5B',
    ']': '%5D',
  };

  it('should percent-encode character if encode-set predicate returns true', () => {
    _forEach(INPUTS, (expectedPercentEncoded, character) => {
      const encodeSet = jasmine.createSpy('encodeSet').and.returnValue(true);
      const percentEncoded = percentEncode(character, encodeSet);
      expect(percentEncoded).toBe(expectedPercentEncoded);
      expect(encodeSet).toHaveBeenCalled();
    });
  });

  it('should not percent-encode character if encode-set predicate returns false', () => {
    _forEach(INPUTS, (expectedPercentEncoded, character) => {
      const encodeSet = jasmine.createSpy('encodeSet').and.returnValue(false);
      const percentEncoded = percentEncode(character, encodeSet);
      expect(percentEncoded).toBe(character);
      expect(encodeSet).toHaveBeenCalled();
    });
  });
});
