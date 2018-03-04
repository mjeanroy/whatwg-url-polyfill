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
import {schemeStartState} from 'src/core/whatwg/url/parser/states/scheme-start-state';

describe('schemeStartState', () => {
  it('should handle alpha character', () => {
    const c = 'h';
    const sm = {
      pointer: 0,
      buffer: '',
      state: 'scheme start state',
      stateOverride: null,
      validationError: false,
    };

    const result = schemeStartState(sm, c);

    expect(result).not.toBe(FAILURE);
    expect(sm.pointer).toBe(0);
    expect(sm.buffer).toBe('h');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
  });

  it('should handle upper alpha character', () => {
    const c = 'H';
    const sm = {
      pointer: 0,
      buffer: '',
      state: 'scheme start state',
      stateOverride: null,
      validationError: false,
    };

    const result = schemeStartState(sm, c);

    expect(result).not.toBe(FAILURE);
    expect(sm.pointer).toBe(0);
    expect(sm.buffer).toBe('h');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
  });

  it('should not fail with digit character and without stateOverride', () => {
    const c = '0';
    const sm = {
      pointer: 1,
      buffer: '',
      state: 'scheme start state',
      stateOverride: null,
      validationError: false,
    };

    const result = schemeStartState(sm, c);

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
  });

  it('should fail with digit character and with stateOverride', () => {
    const c = '0';
    const sm = {
      pointer: 0,
      buffer: '',
      state: 'scheme start state',
      stateOverride: 'scheme start state',
      validationError: false,
    };

    const result = schemeStartState(sm, c);

    expect(result).toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(0);
    expect(sm.state).toBe('scheme start state');
    expect(sm.validationError).toBe(true);
  });
});
