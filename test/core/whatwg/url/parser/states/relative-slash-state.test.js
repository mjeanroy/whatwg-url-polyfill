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
import {relativeSlashState} from 'src/core/whatwg/url/parser/states/relative-slash-state';
import {createStateMachine} from './create-state-machine';

describe('relativeSlashState', () => {
  it('should parse "/" with special url', () => {
    const sm = createStateMachine({
      input: '/test',
      buffer: '',
      pointer: 0,
      state: 'relative state',
      url: {
        scheme: 'http',
      },
    });

    const result = relativeSlashState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('special authority ignore slashes state');
    expect(sm.pointer).toBe(0);
    expect(sm.validationError).toBe(false);
  });

  it('should parse "\\" with special url', () => {
    const sm = createStateMachine({
      input: '\\test',
      buffer: '',
      pointer: 0,
      state: 'relative state',
      url: {
        scheme: 'http',
      },
    });

    const result = relativeSlashState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('special authority ignore slashes state');
    expect(sm.pointer).toBe(0);
    expect(sm.validationError).toBe(true);
  });

  it('should parse "/" without special url', () => {
    const sm = createStateMachine({
      input: '/test',
      buffer: '',
      pointer: 0,
      state: 'relative state',
      url: {
        scheme: 'git',
      },
    });

    const result = relativeSlashState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('authority state');
    expect(sm.pointer).toBe(0);
    expect(sm.validationError).toBe(false);
  });

  it('should parse other character than "/"', () => {
    const sm = createStateMachine({
      input: 'test',
      buffer: '',
      pointer: 0,
      state: 'relative state',
      url: {
        scheme: 'http',
      },

      base: {
        username: 'username',
        password: 'password',
        host: 'localhost',
        port: 8080,
      },
    });

    const result = relativeSlashState(sm, 't');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.validationError).toBe(false);
    expect(sm.url.username).toBe(sm.base.username);
    expect(sm.url.password).toBe(sm.base.password);
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.port).toBe(sm.base.port);
  });
});
