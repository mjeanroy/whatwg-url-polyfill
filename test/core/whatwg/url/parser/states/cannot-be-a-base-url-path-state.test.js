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
import {cannotBeABaseURLPathState} from 'src/core/whatwg/url/parser/states/cannot-be-a-base-url-path-state';
import {createStateMachine} from './create-state-machine';

describe('cannotBeABaseURLPathState', () => {
  it('should handle "?" character', () => {
    const sm = createStateMachine({
      input: '?test',
      buffer: '',
      pointer: 0,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('query state');
    expect(sm.pointer).toBe(0);
    expect(sm.validationError).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBe('');
    expect(sm.url.fragment).toBeNull();
  });

  it('should handle "#" character', () => {
    const sm = createStateMachine({
      input: '#test',
      buffer: '',
      pointer: 0,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(0);
    expect(sm.validationError).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBe('');
  });

  it('should handle "%" with following hex digits', () => {
    const sm = createStateMachine({
      input: '#%40',
      buffer: '',
      pointer: 1,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('cannot-be-a-base-URL path state');
    expect(sm.pointer).toBe(1);
    expect(sm.validationError).toBe(false);
    expect(sm.url.path).toEqual(['%']);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
  });

  it('should handle "%" with following next non hex digits', () => {
    const sm = createStateMachine({
      input: '#%X0',
      buffer: '',
      pointer: 1,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('cannot-be-a-base-URL path state');
    expect(sm.pointer).toBe(1);
    expect(sm.validationError).toBe(true);
    expect(sm.url.path).toEqual(['%']);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
  });

  it('should handle "%" with following next+1 non hex digits', () => {
    const sm = createStateMachine({
      input: '#%0X',
      buffer: '',
      pointer: 1,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('cannot-be-a-base-URL path state');
    expect(sm.pointer).toBe(1);
    expect(sm.validationError).toBe(true);
    expect(sm.url.path).toEqual(['%']);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
  });

  it('should handle "%" with missing next hex digits', () => {
    const sm = createStateMachine({
      input: '#%',
      buffer: '',
      pointer: 1,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('cannot-be-a-base-URL path state');
    expect(sm.pointer).toBe(1);
    expect(sm.validationError).toBe(true);
    expect(sm.url.path).toEqual(['%']);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
  });

  it('should handle "NON URL Code Point"', () => {
    const TAB = String.fromCharCode(0x0009);
    const sm = createStateMachine({
      input: `#${TAB}`,
      buffer: '',
      pointer: 1,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, TAB);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('cannot-be-a-base-URL path state');
    expect(sm.pointer).toBe(1);
    expect(sm.validationError).toBe(true);
    expect(sm.url.path).toEqual(['%09']);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
  });

  it('should handle "EOF"', () => {
    const sm = createStateMachine({
      input: `#`,
      buffer: '',
      pointer: 1,
      state: 'cannot-be-a-base-URL path state',
    });

    const result = cannotBeABaseURLPathState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('cannot-be-a-base-URL path state');
    expect(sm.pointer).toBe(1);
    expect(sm.validationError).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
  });
});
