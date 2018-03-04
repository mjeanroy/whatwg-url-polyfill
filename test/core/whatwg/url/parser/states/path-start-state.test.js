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
import {pathStartState} from 'src/core/whatwg/url/parser/states/path-start-state';
import {createStateMachine} from './create-state-machine';

describe('pathStartState', () => {
  it('should handle special URL with "/" character', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080/test',
      buffer: '',
      pointer: 21,
      state: 'path start state',
      url: {
        scheme: 'http',
        host: 'localhost',
        port: 8080,
      },
    });

    const result = pathStartState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(21);
    expect(sm.validationError).toBe(false);
  });

  it('should handle special URL with "\\" character', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080\\test',
      buffer: '',
      pointer: 21,
      state: 'path start state',
      url: {
        scheme: 'http',
        host: 'localhost',
        port: 8080,
      },
    });

    const result = pathStartState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(21);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();

    expect(sm.validationError).toBe(true);
  });

  it('should handle special URL with other character', () => {
    const sm = createStateMachine({
      input: 'test',
      buffer: '',
      pointer: 0,
      state: 'path start state',
      url: {
        scheme: 'http',
        host: 'localhost',
        port: 8080,
      },
    });

    const result = pathStartState(sm, 't');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should non-special URL without "stateOverride" and with "?" character', () => {
    const sm = createStateMachine({
      input: 'git://localhost?test',
      buffer: '',
      pointer: 15,
      state: 'path start state',
      url: {
        scheme: 'git',
        host: 'localhost',
        port: 80,
      },
    });

    const result = pathStartState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('query state');
    expect(sm.pointer).toBe(15);
    expect(sm.url.query).toBe('');
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should non-special URL without "stateOverride" and with "?" character', () => {
    const sm = createStateMachine({
      input: 'git://localhost#test',
      buffer: '',
      pointer: 15,
      state: 'path start state',
      url: {
        scheme: 'git',
        host: 'localhost',
        port: 80,
      },
    });

    const result = pathStartState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(15);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBe('');
    expect(sm.validationError).toBe(false);
  });

  it('should non-special URL and with "EOF" character', () => {
    const sm = createStateMachine({
      input: 'git://localhost',
      buffer: '',
      pointer: 15,
      state: 'path start state',
      url: {
        scheme: 'git',
        host: 'localhost',
        port: 80,
      },
    });

    const result = pathStartState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(15);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should non-special URL and with "/" character', () => {
    const sm = createStateMachine({
      input: 'git://localhost/test',
      buffer: '',
      pointer: 15,
      state: 'path start state',
      url: {
        scheme: 'git',
        host: 'localhost',
        port: 80,
      },
    });

    const result = pathStartState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(15);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should non-special URL and with alpha character', () => {
    const sm = createStateMachine({
      input: 'git://localhost/test',
      buffer: '',
      pointer: 16,
      state: 'path start state',
      url: {
        scheme: 'git',
        host: 'localhost',
        port: 80,
      },
    });

    const result = pathStartState(sm, 't');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(15);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });
});
