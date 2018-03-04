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

import {clone} from 'src/core/lang/clone';

describe('clone', () => {
  it('should return nil', () => {
    expect(clone(null)).toBe(null);
    expect(clone(undefined)).toBe(undefined);
  });

  it('should return primitives', () => {
    expect(clone(0)).toBe(0);
    expect(clone(true)).toBe(true);
    expect(clone(false)).toBe(false);
    expect(clone('')).toBe('');
  });

  it('should clone copy of array', () => {
    const array = [0, 1, 2];
    const copy = clone(array);

    expect(copy).not.toBe(array);
    expect(copy).toEqual(array);
  });

  it('should clone copy of object', () => {
    const o = {
      id: 1,
      name: 'John Doe',
    };

    const copy = clone(o);

    expect(copy).not.toBe(o);
    expect(copy).toEqual(o);
  });
});
