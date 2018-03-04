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
import {schemeState} from 'src/core/whatwg/url/parser/states/scheme-state';
import {createStateMachine} from './create-state-machine';

describe('schemeState', () => {
  it('should parse scheme with alphanumeric character [1]', () => {
    const sm = createStateMachine();
    const result = schemeState(sm, 't');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('ht');
    expect(sm.pointer).toBe(1);
    expect(sm.url.scheme).toBe('');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse scheme with + character [1]', () => {
    const sm = createStateMachine({
      input: 'git+ssh://github.com/mjeanroy',
      buffer: 'git',
      pointer: 3,
    });

    const result = schemeState(sm, '+');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('git+');
    expect(sm.pointer).toBe(3);
    expect(sm.url.scheme).toBe('');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse scheme with - character [1]', () => {
    const sm = createStateMachine({
      input: 'git-ssh://github.com/mjeanroy',
      buffer: 'git',
      pointer: 3,
    });

    const result = schemeState(sm, '-');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('git-');
    expect(sm.pointer).toBe(3);
    expect(sm.url.scheme).toBe('');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse scheme with . character', () => {
    const sm = createStateMachine({
      input: 'git.ssh://github.com/mjeanroy',
      buffer: 'git',
      pointer: 3,
    });

    const result = schemeState(sm, '.');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('git.');
    expect(sm.pointer).toBe(3);
    expect(sm.url.scheme).toBe('');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse scheme with : character [2.7]', () => {
    const sm = createStateMachine({
      buffer: 'http',
      pointer: 4,
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('http');
    expect(sm.state).toBe('special authority slashes state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse scheme with : character with non special scheme [2.8]', () => {
    const sm = createStateMachine({
      input: 'npm://mjeanroy',
      buffer: 'npm',
      pointer: 3,
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('npm');
    expect(sm.state).toBe('path or authority state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse file scheme with : character [2.5]', () => {
    const sm = createStateMachine({
      input: 'file://test.txt',
      buffer: 'file',
      pointer: 4,
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('file');
    expect(sm.state).toBe('file');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse file scheme without next slash [2.5.1]', () => {
    const sm = createStateMachine({
      input: 'file:test.txt',
      buffer: 'file',
      pointer: 4,
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('file');
    expect(sm.state).toBe('file');
    expect(sm.validationError).toBe(true);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse file scheme with without second slash [2.5.1]', () => {
    const sm = createStateMachine({
      input: 'file:/test.txt',
      buffer: 'file',
      pointer: 4,
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('file');
    expect(sm.state).toBe('file');
    expect(sm.validationError).toBe(true);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse special scheme with same base scheme [2.6]', () => {
    const sm = createStateMachine({
      input: 'http://localhost',
      buffer: 'http',
      pointer: 4,
      base: {
        scheme: 'http',
      },
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('http');
    expect(sm.state).toBe('special relative or authority state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse scheme and set cannot-be-a-base-url flag [2.9]', () => {
    const sm = createStateMachine({
      input: 'test:localhost',
      buffer: 'test',
      pointer: 4,
      base: null,
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('test');
    expect(sm.state).toBe('cannot-be-a-base-URL path state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(true);
    expect(sm.url.path).toEqual(['']);
    expect(sm.url.port).toBe(null);
  });

  it('should parse special scheme with default port when state override is defined [2.3.1]', () => {
    const sm = createStateMachine({
      input: 'http:localhost',
      buffer: 'http',
      pointer: 4,
      stateOverride: 'scheme state',
      url: {
        scheme: 'http',
        port: 80,
      },
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('http');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('http');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse special scheme with none default port when state override is defined [2.3.2]', () => {
    const sm = createStateMachine({
      input: 'http:localhost',
      buffer: 'http',
      pointer: 4,
      stateOverride: 'scheme state',
      url: {
        scheme: 'http',
        port: 8080,
      },
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('http');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('http');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(8080);
  });

  it('should parse ":" with special url scheme when state override is defined [2.1.1]', () => {
    const sm = createStateMachine({
      input: 'ssh://localhost',
      buffer: 'ssh',
      pointer: 4,
      stateOverride: 'scheme state',
      url: {
        scheme: 'http',
        port: 8080,
      },
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('ssh');
    expect(sm.pointer).toBe(4);
    expect(sm.url.scheme).toBe('http');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(8080);
  });

  it('should parse ":" with special scheme when state override is defined [2.1.2]', () => {
    const sm = createStateMachine({
      input: 'http://localhost',
      buffer: 'http',
      pointer: 5,
      stateOverride: 'scheme state',
      url: {
        scheme: 'ssh',
        port: 8080,
      },
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('http');
    expect(sm.pointer).toBe(5);
    expect(sm.url.scheme).toBe('ssh');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(8080);
  });

  it('should parse ":" with credentials and file scheme when state override is defined [2.1.3]', () => {
    const sm = createStateMachine({
      input: 'file://test.txt',
      buffer: 'file',
      pointer: 5,
      stateOverride: 'scheme state',
      url: {
        scheme: 'file',
        username: 'username',
        password: 'password',
      },
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('file');
    expect(sm.pointer).toBe(5);
    expect(sm.url.scheme).toBe('file');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse ":" without credentials, with port and file scheme when state override is defined [2.1.3]', () => {
    const sm = createStateMachine({
      input: 'file://test.txt',
      buffer: 'file',
      pointer: 5,
      stateOverride: 'scheme state',
      url: {
        scheme: 'file',
        port: 8080,
      },
    });

    const result = schemeState(sm, ':');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('file');
    expect(sm.pointer).toBe(5);
    expect(sm.url.scheme).toBe('file');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(8080);
  });

  it('should parse non scheme base character without state override given [3]', () => {
    const sm = createStateMachine({
      input: 'http://localhost',
      buffer: 'http',
      pointer: 5,
    });

    const result = schemeState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.buffer).toBe('');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('');
    expect(sm.state).toBe('no scheme state');
    expect(sm.validationError).toBe(false);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });

  it('should parse non scheme base character with state override given [4]', () => {
    const sm = createStateMachine({
      input: 'http://localhost',
      buffer: 'http',
      pointer: 5,
      stateOverride: 'scheme state',
    });

    const result = schemeState(sm, '/');

    expect(result).toBe(FAILURE);
    expect(sm.buffer).toBe('http');
    expect(sm.pointer).toBe(5);
    expect(sm.url.scheme).toBe('');
    expect(sm.state).toBe('scheme state');
    expect(sm.validationError).toBe(true);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.port).toBe(null);
  });
});
