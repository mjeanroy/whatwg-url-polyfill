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
import {fragmentState} from 'src/core/whatwg/url/parser/states/fragment-state';
import {createStateMachine} from './create-state-machine';

describe('fragmentState', () => {
  it('should handle URL character', () => {
    const sm = createStateMachine({
      input: '#test',
      buffer: '',
      pointer: 1,
      state: 'fragment state',
      url: {
        fragment: '',
      },
    });

    const result = fragmentState(sm, 't');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(1);
    expect(sm.validationError).toBe(false);
    expect(sm.url.fragment).toBe('t');
  });

  it('should handle "EOF" character', () => {
    const sm = createStateMachine({
      input: '#test',
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(false);
    expect(sm.url.fragment).toBe('test');
  });

  it('should handle "NULL" character', () => {
    const sm = createStateMachine({
      input: '#test',
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, String.fromCharCode(0x0000));

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(true);
    expect(sm.url.fragment).toBe('test');
  });

  it('should handle "%" character with following hex chars', () => {
    const sm = createStateMachine({
      input: '#test%40',
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(false);
    expect(sm.url.fragment).toBe('test%');
  });

  it('should handle "%" character with following hex chars', () => {
    const sm = createStateMachine({
      input: '#test%40',
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(false);
    expect(sm.url.fragment).toBe('test%');
  });

  it('should handle "%" character with missing hex chars', () => {
    const sm = createStateMachine({
      input: '#test%',
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(true);
    expect(sm.url.fragment).toBe('test%');
  });

  it('should handle "%" character with next non hex chars', () => {
    const sm = createStateMachine({
      input: '#test%X0',
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(true);
    expect(sm.url.fragment).toBe('test%');
  });

  it('should handle "%" character with next+1 non hex chars', () => {
    const sm = createStateMachine({
      input: '#test%0X',
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, '%');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(true);
    expect(sm.url.fragment).toBe('test%');
  });

  it('should handle non URL code point character', () => {
    const TAB = String.fromCharCode(0x0009);
    const sm = createStateMachine({
      input: `#test${TAB}1`,
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, TAB);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(true);
    expect(sm.url.fragment).toBe(`test%09`);
  });

  it('should handle percent encoded character', () => {
    const sm = createStateMachine({
      input: `#test<`,
      buffer: '',
      pointer: 5,
      state: 'fragment state',
      url: {
        fragment: 'test',
      },
    });

    const result = fragmentState(sm, '<');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(true);
    expect(sm.url.fragment).toBe(`test%3C`);
  });
});
