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

import {toHex} from 'src/core/lang/to-hex';

describe('toHex', () => {
  it('should return hexadecimal value', () => {
    expect(toHex(0)).toBe('00');
    expect(toHex(1)).toBe('01');
    expect(toHex(2)).toBe('02');
    expect(toHex(3)).toBe('03');
    expect(toHex(4)).toBe('04');
    expect(toHex(5)).toBe('05');
    expect(toHex(6)).toBe('06');
    expect(toHex(7)).toBe('07');
    expect(toHex(8)).toBe('08');
    expect(toHex(9)).toBe('09');
    expect(toHex(10)).toBe('0A');
    expect(toHex(11)).toBe('0B');
    expect(toHex(12)).toBe('0C');
    expect(toHex(13)).toBe('0D');
    expect(toHex(14)).toBe('0E');
    expect(toHex(15)).toBe('0F');
    expect(toHex(16)).toBe('10');
    expect(toHex(17)).toBe('11');
  });
});
