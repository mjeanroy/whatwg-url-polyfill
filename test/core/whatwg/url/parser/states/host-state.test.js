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
import {hostState} from 'src/core/whatwg/url/parser/states/host-state';
import {createStateMachine} from './create-state-machine';

describe('hostState', () => {
  it('should parser ":" character', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080',
      buffer: 'localhost',
      pointer: 16,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('port state');
    expect(sm.pointer).toBe(16);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.url.host).toBe('localhost');
  });

  it('should parser aphanumeric character', () => {
    const sm = createStateMachine({
      input: 'http://localhost:8080',
      buffer: 'loc',
      pointer: 10,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, 'a');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(10);
    expect(sm.buffer).toBe('loca');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.url.host).toBeNull();
  });

  it('should parser "[" character', () => {
    const sm = createStateMachine({
      input: 'http://[2001:0660:7401:0200:0000:0000:0edf:bdd7]:8080',
      buffer: '',
      pointer: 7,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, '[');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(7);
    expect(sm.buffer).toBe('[');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(true);
    expect(sm.url.host).toBeNull();
  });

  it('should parser ":" character of ipv6', () => {
    const sm = createStateMachine({
      input: 'http://[2001:0660:7401:0200:0000:0000:0edf:bdd7]:8080',
      buffer: '[2001',
      pointer: 12,
      state: 'host state',
      arrFlag: true,
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(12);
    expect(sm.buffer).toBe('[2001:');
    expect(sm.validationError).toBe(false);
    expect(sm.url.host).toBeNull();
  });

  it('should parser "]" character', () => {
    const sm = createStateMachine({
      input: 'http://[2001:0660:7401:0200:0000:0000:0edf:bdd7]:8080',
      buffer: '[2001:0660:7401:0200:0000:0000:0edf:bdd7',
      pointer: 47,
      state: 'host state',
      arrFlag: true,
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, ']');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(47);
    expect(sm.buffer).toBe('[2001:0660:7401:0200:0000:0000:0edf:bdd7]');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.url.host).toBeNull();
  });

  it('should parser "EOF" character', () => {
    const sm = createStateMachine({
      input: 'http://localhost',
      buffer: 'localhost',
      pointer: 16,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(15);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.url.host).toBe('localhost');
  });

  it('should parser "/" character', () => {
    const sm = createStateMachine({
      input: 'http://localhost/path',
      buffer: 'localhost',
      pointer: 16,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(15);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.url.host).toBe('localhost');
  });

  it('should parser "?" character', () => {
    const sm = createStateMachine({
      input: 'http://localhost?s',
      buffer: 'localhost',
      pointer: 16,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(15);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.url.host).toBe('localhost');
  });

  it('should parser "#" character', () => {
    const sm = createStateMachine({
      input: 'http://localhost#anchor',
      buffer: 'localhost',
      pointer: 16,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(15);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.url.host).toBe('localhost');
  });

  it('should parser "\\" character', () => {
    const sm = createStateMachine({
      input: 'file://localhost\\path',
      buffer: 'localhost',
      pointer: 16,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path start state');
    expect(sm.pointer).toBe(15);
    expect(sm.buffer).toBe('');
    expect(sm.validationError).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.url.host).toBe('localhost');
  });

  it('should fail to parse empty domain', () => {
    const sm = createStateMachine({
      input: 'http:///path',
      buffer: '',
      pointer: 7,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, '/');
    expect(result).toBe(FAILURE);
  });

  it('should fail to parse invalid domain when "/" character is encountered', () => {
    const sm = createStateMachine({
      input: 'http://256.256.256.256/path',
      buffer: '',
      pointer: 22,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, '/');
    expect(result).toBe(FAILURE);
  });

  it('should parse ":" character with empty buffer', () => {
    const sm = createStateMachine({
      input: 'http://:8080',
      buffer: '',
      pointer: 7,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, ':');
    expect(result).toBe(FAILURE);
    expect(sm.validationError).toBe(true);
  });

  it('should parser ":" character with invalid IP', () => {
    const sm = createStateMachine({
      input: 'http://256.256.256.256:8080',
      buffer: '256.256.256.256',
      pointer: 22,
      state: 'host state',
      url: {
        scheme: 'http',
      },
    });

    const result = hostState(sm, ':');
    expect(result).toBe(FAILURE);
  });

  it('should switch state on file scheme', () => {
    const sm = createStateMachine({
      input: 'file://foo',
      buffer: '',
      pointer: 22,
      state: 'host state',
      url: {
        scheme: 'file',
      },
    });

    const result = hostState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('file host state');
    expect(sm.pointer).toBe(21);
    expect(sm.validationError).toBe(false);
  });
});
