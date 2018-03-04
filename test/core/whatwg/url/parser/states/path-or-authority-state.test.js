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
import {pathOrAuthorityState} from 'src/core/whatwg/url/parser/states/path-or-authority-state';
import {createStateMachine} from './create-state-machine';

describe('pathOrAuthorityState', () => {
  it('should parse "/" character', () => {
    const sm = createStateMachine({
      input: '/test',
      buffer: '',
      pointer: 0,
      state: 'path or authority state',
    });

    const result = pathOrAuthorityState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('authority state');
    expect(sm.pointer).toBe(0);
  });

  it('should parse character other than "/"', () => {
    const sm = createStateMachine({
      input: 'test',
      buffer: '',
      pointer: 0,
      state: 'path or authority state',
    });

    const result = pathOrAuthorityState(sm, 't');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
  });
});
