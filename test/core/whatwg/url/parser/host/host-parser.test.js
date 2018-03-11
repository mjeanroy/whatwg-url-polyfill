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
import {hostParser} from 'src/core/whatwg/url/parser/host/host-parser';

describe('hostParser', () => {
  it('should parse ipv6', () => {
    const isSpecial = false;
    const ipv6 = '2001:0660:7401:0200:0000:0000:0edf:bdd7';
    const address = hostParser(`[${ipv6}]`, isSpecial);
    expect(address).not.toBe(FAILURE);
    expect(address).toEqual([8193, 1632, 29697, 512, 0, 0, 3807, 48599]);
  });

  it('should parse opaque host', () => {
    const isSpecial = false;
    const ipv4 = '101.102.103.104';
    const address = hostParser(ipv4, isSpecial);
    expect(address).not.toBe(FAILURE);
    expect(address).toEqual(ipv4);
  });

  it('should parse ipv4', () => {
    const isSpecial = true;
    const ipv4 = '101.102.103.104';
    const address = hostParser(ipv4, isSpecial);
    expect(address).not.toBe(FAILURE);
    expect(address).toEqual(1701209960);
  });

  it('should parse domain name', () => {
    const isSpecial = true;
    const domainName = 'localhost';
    const address = hostParser(domainName, isSpecial);
    expect(address).not.toBe(FAILURE);
    expect(address).toEqual(domainName);
  });

  it('should parse non valid domain starting with "["', () => {
    const isSpecial = true;
    const ipv6 = '2001:0660:7401:0200:0000:0000:0edf:bdd7';
    const address = hostParser(`[${ipv6}`, isSpecial);
    expect(address).toBe(FAILURE);
  });

  it('should parse non valid ipv6', () => {
    const isSpecial = true;
    const ipv6 = '2001:0db8:3c4d:0015:0000:0000:1a2f';
    const address = hostParser(`[${ipv6}]`, isSpecial);
    expect(address).toBe(FAILURE);
  });

  it('should parse non valid ipv4', () => {
    const isSpecial = true;
    const ipv4 = '101.256.103.104';
    const address = hostParser(ipv4, isSpecial);
    expect(address).toBe(FAILURE);
  });
});
