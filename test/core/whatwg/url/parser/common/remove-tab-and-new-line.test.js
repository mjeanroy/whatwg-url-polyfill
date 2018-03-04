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

import {removeTabAndNewLine} from 'src/core/whatwg/url/parser/common/remove-tab-and-new-line';

describe('trimTabAndNewLine', () => {
  // The horizontal tabulation.
  // https://everythingfonts.com/unicode/0x0009
  const TAB = String.fromCharCode(0x0009);

  // The NL character.
  // https://everythingfonts.com/unicode/0x000A
  const NL = String.fromCharCode(0x000A);

  // The carriage-return character
  // https://everythingfonts.com/unicode/0x000D
  const RC = String.fromCharCode(0x000D);

  it('should not change empty string', () => {
    expect(removeTabAndNewLine('')).toBe('');
  });

  it('should return empty string if it contains only TAB character', () => {
    expect(removeTabAndNewLine(TAB)).toBe('');
  });

  it('should return empty string if it contains only RC character', () => {
    expect(removeTabAndNewLine(RC)).toBe('');
  });

  it('should return empty string if it contains only NL characters', () => {
    expect(removeTabAndNewLine(NL)).toBe('');
  });

  it('should return string without tab/new line characters', () => {
    const input = `f${TAB}o${NL}${RC}o`;
    expect(removeTabAndNewLine(input)).toBe('foo');
  });
});
