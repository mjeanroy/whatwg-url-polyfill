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

import {some} from 'src/core/lang/some';

describe('some', () => {
  it('should returns true if one element in array verify predicate', () => {
    const array = [1, 2, 3];
    const iteratee = jasmine.createSpy('iteratee').and.callFake((x) => (
      x % 2 === 0
    ));

    const r = some(array, iteratee);

    expect(r).toBe(true);
    expect(iteratee).toHaveBeenCalledWith(1, 0, array);
    expect(iteratee).toHaveBeenCalledWith(2, 1, array);
    expect(iteratee).not.toHaveBeenCalledWith(3, 2, array);
  });

  it('should returns false if no element in array verify predicate', () => {
    const array = [1, 3, 5];
    const iteratee = jasmine.createSpy('iteratee').and.callFake((x) => (
      x % 2 === 0
    ));

    const r = some(array, iteratee);

    expect(r).toBe(false);
    expect(iteratee).toHaveBeenCalledWith(1, 0, array);
    expect(iteratee).toHaveBeenCalledWith(3, 1, array);
    expect(iteratee).toHaveBeenCalledWith(5, 2, array);
  });

  it('should returns false with empty array', () => {
    const array = [];
    const iteratee = jasmine.createSpy('iteratee').and.returnValue(true);
    const r = some(array, iteratee);

    expect(r).toBe(false);
    expect(iteratee).not.toHaveBeenCalled();
  });
});
