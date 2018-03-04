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
import {ipv6Parser} from 'src/core/whatwg/url/parser/host/ipv6-parser';

describe('ipv6Parser', () => {
  it('should parse valid ipv6', () => {
    const ipv6 = '2001:0660:7401:0200:0000:0000:0edf:bdd7';
    const address = ipv6Parser(ipv6);
    expect(address).toEqual([8193, 1632, 29697, 512, 0, 0, 3807, 48599]);
  });

  it('should parse short ipv6', () => {
    const fullIpv6 = '2001:0db8:3c4d:0015:0000:0000:1a2f:1a2b';
    const a1 = ipv6Parser(fullIpv6);
    expect(a1).toEqual([8193, 3512, 15437, 21, 0, 0, 6703, 6699]);

    const compressIpv6 = '2001:0db8:3c4d:0015::1a2f:1a2b';
    const a2 = ipv6Parser(compressIpv6);
    expect(a2).toEqual(a1);

    const shortIpv6 = '2001:db8:3c4d:15::1a2f:1a2b';
    const a3 = ipv6Parser(shortIpv6);
    expect(a3).toEqual(a1);
  });

  it('should parse short ipv6', () => {
    const fullIpv6 = '2001:0db8:3c4d:0015:0000:0000:1a2f:1a2b';
    const a1 = ipv6Parser(fullIpv6);
    expect(a1).toEqual([8193, 3512, 15437, 21, 0, 0, 6703, 6699]);

    const compressIpv6 = '2001:0db8:3c4d:0015::1a2f:1a2b';
    const a2 = ipv6Parser(compressIpv6);
    expect(a2).toEqual(a1);

    const shortIpv6 = '2001:db8:3c4d:15::1a2f:1a2b';
    const a3 = ipv6Parser(shortIpv6);
    expect(a3).toEqual(a1);
  });

  it('should return failure with invalid ipv6', () => {
    const input = '2001:0db8:3c4d:0015:0000:0000:1a2f';
    const result = ipv6Parser(input);
    expect(result).toBe(FAILURE);
  });

  it('should return failure with non HEX character in ipv6 piece', () => {
    const input = '2001:0db8:3c4x:0015:0000:0000:1a2f:1a2b';
    const result = ipv6Parser(input);
    expect(result).toBe(FAILURE);
  });

  it('should return failure with long ipv6 piece', () => {
    const input = '2001:0db8:3c4ff:0015:0000:0000:1a2f:1a2b';
    const result = ipv6Parser(input);
    expect(result).toBe(FAILURE);
  });
});
