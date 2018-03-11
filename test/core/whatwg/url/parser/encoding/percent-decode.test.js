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
import {percentDecode} from 'src/core/whatwg/url/parser/encoding/percent-decode';
import {INPUTS} from './inputs';

describe('percentDecode', () => {
  it('should percent-decode character', () => {
    _forEach(INPUTS, (encoded, character) => {
      expect(percentDecode(encoded)).toBe(character);
    });
  });

  it('should percent-decode simple character', () => {
    expect(percentDecode('a')).toBe('a');
    expect(percentDecode('z')).toBe('z');
    expect(percentDecode('e')).toBe('e');
    expect(percentDecode('r')).toBe('r');
    expect(percentDecode('t')).toBe('t');
    expect(percentDecode('y')).toBe('y');
  });

  it('should percent-decode non hex charachters', () => {
    expect(percentDecode('%XX')).toBe('%XX');
    expect(percentDecode('%AX')).toBe('%AX');
    expect(percentDecode('%XA')).toBe('%XA');
  });
});
