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
import {fileSlashState} from 'src/core/whatwg/url/parser/states/file-slash-state';
import {createStateMachine} from './create-state-machine';

describe('fileSlashState', () => {
  it('should handle "/" character', () => {
    const sm = createStateMachine({
      input: 'C://localhost',
      buffer: '',
      pointer: 2,
      state: 'file slash state',
      url: {
        scheme: 'file',
      },
    });

    const result = fileSlashState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(2);
    expect(sm.url.scheme).toBe('file');
    expect(sm.validationError).toBe(false);
  });

  it('should handle "\\" character', () => {
    const sm = createStateMachine({
      input: 'C:\\\\localhost',
      buffer: '',
      pointer: 2,
      state: 'file slash state',
      url: {
        scheme: 'file',
      },
    });

    const result = fileSlashState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(2);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBeNull();
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(true);
  });

  it('should handle other charachter with base scheme equal to file', () => {
    const sm = createStateMachine({
      input: 'path',
      buffer: '',
      pointer: 0,
      state: 'file slash state',
      url: {
        scheme: 'file',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileSlashState(sm, 'p');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should handle other charachter with base scheme equal to file and base path equal to windows drive letter', () => {
    const sm = createStateMachine({
      input: 'path',
      buffer: '',
      pointer: 0,
      state: 'file slash state',
      url: {
        scheme: 'file',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['C:', 'test'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileSlashState(sm, 'p');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBeNull();
    expect(sm.url.path).toEqual(['C:']);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should handle other charachter with base scheme equal to file and starting with windows drive letter', () => {
    const sm = createStateMachine({
      input: 'C://test',
      buffer: '',
      pointer: 0,
      state: 'file slash state',
      url: {
        scheme: 'file',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileSlashState(sm, 'p');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBeNull();
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should handle other charachter with base scheme other than file', () => {
    const sm = createStateMachine({
      input: 'path',
      buffer: '',
      pointer: 0,
      state: 'file slash state',
      url: {
        scheme: 'file',
      },

      base: {
        scheme: 'http',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileSlashState(sm, 'p');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBeNull();
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should handle other charachter without base', () => {
    const sm = createStateMachine({
      input: 'path',
      buffer: '',
      pointer: 0,
      state: 'file slash state',
      url: {
        scheme: 'file',
      },
    });

    const result = fileSlashState(sm, 'p');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBeNull();
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });
});
