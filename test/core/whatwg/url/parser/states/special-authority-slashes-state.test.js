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
import {specialAuthoritySlashesState} from 'src/core/whatwg/url/parser/states/special-authority-slashes-state';
import {createStateMachine} from './create-state-machine';

describe('specialAuthoritySlashesState', () => {
  it('should parse "//" charachters', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080',
      buffer: 'http',
      pointer: 5,
      state: 'special authority slashes state',
    });

    const result = specialAuthoritySlashesState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.validationError).toBe(false);
    expect(sm.pointer).toBe(6);
    expect(sm.state).toBe('special authority ignore slashes state');
  });

  it('should parse "/" charachters', () => {
    const sm = createStateMachine({
      input: 'http:/localhost:8080',
      buffer: 'http',
      pointer: 5,
      state: 'special authority slashes state',
    });

    const result = specialAuthoritySlashesState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.validationError).toBe(true);
    expect(sm.pointer).toBe(4);
    expect(sm.state).toBe('special authority ignore slashes state');
  });
});
