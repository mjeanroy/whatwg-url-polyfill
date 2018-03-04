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

import {FAILURE} from 'src/core/whatwg/url/parser/common/failure';
import {ipv4Parser} from 'src/core/whatwg/url/parser/host/ipv4-parser';

describe('ipv4Parser', () => {
  it('should parse valid ipv4', () => {
    const ipv4 = '101.102.103.104';
    const n = ipv4Parser(ipv4);
    expect(n).not.toBe(FAILURE);
    expect(n).toEqual(1701209960);
  });

  it('should return input with ipv4 with more than 4 parts', () => {
    const ipv4 = '101.102.103.104.105';
    const n = ipv4Parser(ipv4);
    expect(n).not.toBe(FAILURE);
    expect(n).toBe(ipv4);
  });

  it('should not arse invalid ipv4', () => {
    const ipv4 = '101.102..103.104';
    const n = ipv4Parser(ipv4);
    expect(n).not.toBe(FAILURE);
    expect(n).toBe(ipv4);
  });

  it('should parse octal ipv4', () => {
    const ipv4 = '0145.0146.0147.0150';
    const n = ipv4Parser(ipv4);
    expect(n).not.toBe(FAILURE);
    expect(n).toBe(1701209960);
  });

  it('should parse hexadecimal ipv4', () => {
    const ipv4 = '0x65.0X66.0x67.0X68';
    const n = ipv4Parser(ipv4);
    expect(n).not.toBe(FAILURE);
    expect(n).toBe(1701209960);
  });

  it('should return failure with ipv4 part > 255', () => {
    const ipv4 = '101.256.103.104';
    const n = ipv4Parser(ipv4);
    expect(n).toBe(FAILURE);
  });

  it('should return failure with ipv4 last part is not valid', () => {
    const ipv4 = '101.256.103.1099511627776';
    const n = ipv4Parser(ipv4);
    expect(n).toBe(FAILURE);
  });

  it('should return failure with invalid ipv4 part', () => {
    const ipv4 = '101.xx.103.104';
    const n = ipv4Parser(ipv4);
    expect(n).toBe(ipv4);
  });
});
