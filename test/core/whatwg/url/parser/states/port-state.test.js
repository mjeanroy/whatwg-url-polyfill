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
import {portState} from 'src/core/whatwg/url/parser/states/port-state';
import {createStateMachine} from './create-state-machine';

describe('portState', () => {
  it('should parser digit character', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080',
      buffer: '',
      pointer: 17,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '8');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('port state');
    expect(sm.pointer).toBe(17);
    expect(sm.buffer).toBe('8');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBeNull();
  });

  it('should parser "EOF" character with non default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080',
      buffer: '8080',
      pointer: 21,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(20);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBe(8080);
  });

  it('should parser "/" character with non default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080/path',
      buffer: '8080',
      pointer: 21,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(20);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBe(8080);
  });

  it('should parser "?" character with non default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080?q',
      buffer: '8080',
      pointer: 21,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(20);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBe(8080);
  });

  it('should parser "#" character with non default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080#f',
      buffer: '8080',
      pointer: 21,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(20);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBe(8080);
  });

  it('should parser "\\" character with special url', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080\\path',
      buffer: '8080',
      pointer: 21,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(20);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBe(8080);
  });

  it('should parser "EOF" character with default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:80',
      buffer: '80',
      pointer: 19,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(18);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBeNull();
  });

  it('should parser "/" character with default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:80/path',
      buffer: '80',
      pointer: 19,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(18);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBeNull();
  });

  it('should parser "?" character with default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:80?q',
      buffer: '80',
      pointer: 19,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(18);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBeNull();
  });

  it('should parser "#" character with default port', () => {
    const sm = createStateMachine({
      input: 'http://localhost:80#f',
      buffer: '80',
      pointer: 19,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(18);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBeNull();
  });

  it('should parser fail with invalid port', () => {
    const port = Math.pow(2, 16);
    const input = `http://localhost:${port}`;
    const sm = createStateMachine({
      input,
      buffer: `${port}`,
      pointer: input.length,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, undefined);

    expect(result).toBe(FAILURE);
    expect(sm.url.port).toBeNull();
  });

  it('should parser "EOF" character without any port', () => {
    const sm = createStateMachine({
      input: 'http://localhost',
      buffer: '',
      pointer: 15,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(14);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.port).toBeNull();
  });

  it('should fail with alpha character', () => {
    const sm = createStateMachine({
      input: 'http://localhost:a',
      buffer: 'a',
      pointer: 17,
      state: 'port state',
      url: {
        scheme: 'http',
        host: 'localhost',
      },
    });

    const result = portState(sm, 'a');

    expect(result).toBe(FAILURE);
    expect(sm.url.port).toBeNull();
  });
});
