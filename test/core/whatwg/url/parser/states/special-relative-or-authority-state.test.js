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

import {FAILURE} from 'src/core/whatwg/url/parser/states/failure';
import {specialRelativeOrAuthorityState} from 'src/core/whatwg/url/parser/states/special-relative-or-authority-state';
import {createStateMachine} from './create-state-machine';

describe('specialRelativeOrAuthorityState', () => {
  it('should parse "//" characters', () => {
    const sm = createStateMachine({
      input: 'http://localhost',
      buffer: 'http',
      pointer: 5,
      state: 'special relative or authority state',
    });

    const result = specialRelativeOrAuthorityState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.pointer).toBe(6);
    expect(sm.state).toBe('special authority ignore slashes state');
    expect(sm.validationError).toBe(false);
  });

  it('should parse character other than "/"', () => {
    const sm = createStateMachine({
      input: 'localhost',
      buffer: '',
      pointer: 0,
      state: 'special relative or authority state',
    });

    const result = specialRelativeOrAuthorityState(sm, 'l');

    expect(result).not.toBe(FAILURE);
    expect(sm.pointer).toBe(-1);
    expect(sm.state).toBe('relative state');
    expect(sm.validationError).toBe(true);
  });

  it('should parse character other than "//"', () => {
    const sm = createStateMachine({
      input: '/localhost',
      buffer: '',
      pointer: 0,
      state: 'special relative or authority state',
    });

    const result = specialRelativeOrAuthorityState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.pointer).toBe(-1);
    expect(sm.state).toBe('relative state');
    expect(sm.validationError).toBe(true);
  });
});
