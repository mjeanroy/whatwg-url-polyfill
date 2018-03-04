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

import {FAILURE} from 'src/core/whatwg/url/parser/common/failure';
import {relativeState} from 'src/core/whatwg/url/parser/states/relative-state';
import {createStateMachine} from './create-state-machine';

describe('relativeState', () => {
  it('should parse EOF character', () => {
    const sm = createStateMachine({
      input: '/test',
      buffer: '/test',
      pointer: 5,
      state: 'relative state',
      base: {
        scheme: 'http',
        username: 'username',
        password: 'password',
        host: 'localhost',
        path: ['/', 'foo'],
        query: 's',
      },
    });

    const result = relativeState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('relative state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(false);
    expect(sm.url.scheme).toBe(sm.base.scheme);
    expect(sm.url.username).toBe(sm.base.username);
    expect(sm.url.password).toBe(sm.base.password);
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual(sm.base.path);
    expect(sm.url.query).toBe(sm.base.query);
    expect(sm.url.fragment).toBe(null);
  });

  it('should parse "/" character', () => {
    const sm = createStateMachine({
      input: '/test',
      buffer: '/test',
      pointer: 0,
      state: 'relative state',
      base: {
        scheme: 'http',
        username: 'username',
        password: 'password',
        host: 'localhost',
        path: ['/', 'foo'],
        query: 's',
      },
    });

    const result = relativeState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('relative slash state');
    expect(sm.pointer).toBe(0);
    expect(sm.validationError).toBe(false);
    expect(sm.url.scheme).toBe('http');
    expect(sm.url.username).toBe('');
    expect(sm.url.password).toBe('');
    expect(sm.url.host).toBe(null);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBe(null);
    expect(sm.url.fragment).toBe(null);
  });

  it('should parse "?" character', () => {
    const sm = createStateMachine({
      input: '/test?q',
      buffer: '/test',
      pointer: 5,
      state: 'relative state',
      base: {
        scheme: 'http',
        username: 'username',
        password: 'password',
        host: 'localhost',
        path: ['/', 'foo'],
        query: 's',
      },
    });

    const result = relativeState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('query state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(false);
    expect(sm.url.scheme).toBe(sm.base.scheme);
    expect(sm.url.username).toBe(sm.base.username);
    expect(sm.url.password).toBe(sm.base.password);
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual(sm.base.path);
    expect(sm.url.query).toBe('');
    expect(sm.url.fragment).toBe(null);
  });

  it('should parse "#" character', () => {
    const sm = createStateMachine({
      input: '/test#f',
      buffer: '/test',
      pointer: 5,
      state: 'relative state',
      base: {
        scheme: 'http',
        username: 'username',
        password: 'password',
        host: 'localhost',
        path: ['/', 'foo'],
        query: 's',
      },
    });

    const result = relativeState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(5);
    expect(sm.validationError).toBe(false);
    expect(sm.url.scheme).toBe(sm.base.scheme);
    expect(sm.url.username).toBe(sm.base.username);
    expect(sm.url.password).toBe(sm.base.password);
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual(sm.base.path);
    expect(sm.url.query).toBe(sm.base.query);
    expect(sm.url.fragment).toBe('');
  });

  it('should parse "\\" character with special url', () => {
    const sm = createStateMachine({
      input: '\\test',
      buffer: '/test',
      pointer: 0,
      state: 'relative state',
      base: {
        scheme: 'http',
        username: 'username',
        password: 'password',
        host: 'localhost',
        path: ['/', 'foo'],
        query: 's',
      },
    });

    const result = relativeState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('relative slash state');
    expect(sm.pointer).toBe(0);
    expect(sm.validationError).toBe(true);
    expect(sm.url.scheme).toBe(sm.base.scheme);
    expect(sm.url.username).toBe('');
    expect(sm.url.password).toBe('');
    expect(sm.url.host).toBe(null);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBe(null);
    expect(sm.url.fragment).toBe(null);
  });

  it('should parse other character with special url', () => {
    const sm = createStateMachine({
      input: 'test',
      buffer: '',
      pointer: 0,
      state: 'relative state',
      base: {
        scheme: 'http',
        username: 'username',
        password: 'password',
        host: 'localhost',
        path: ['/', 'foo'],
        query: 's',
      },
    });

    const result = relativeState(sm, 't');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.validationError).toBe(false);
    expect(sm.url.scheme).toBe(sm.base.scheme);
    expect(sm.url.username).toBe(sm.base.username);
    expect(sm.url.password).toBe(sm.base.password);
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).toEqual(['/']);
    expect(sm.url.query).toBe(null);
    expect(sm.url.fragment).toBe(null);
  });

  it('should parse "\\" character without special url', () => {
    const sm = createStateMachine({
      input: '\\test',
      buffer: '',
      pointer: 0,
      state: 'relative state',
      base: {
        scheme: 'git',
        username: 'username',
        password: 'password',
        host: 'localhost',
        path: ['/', 'foo'],
        query: 's',
      },
    });

    const result = relativeState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.validationError).toBe(false);
    expect(sm.url.scheme).toBe(sm.base.scheme);
    expect(sm.url.username).toBe(sm.base.username);
    expect(sm.url.password).toBe(sm.base.password);
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).toEqual(['/']);
    expect(sm.url.query).toBe(null);
    expect(sm.url.fragment).toBe(null);
  });
});
