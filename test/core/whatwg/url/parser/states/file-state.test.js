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
import {fileState} from 'src/core/whatwg/url/parser/states/file-state';
import {createStateMachine} from './create-state-machine';

describe('fileState', () => {
  it('should handle "/" character', () => {
    const sm = createStateMachine({
      input: 'C://localhost',
      buffer: '',
      pointer: 2,
      state: 'file state',
      url: {
        scheme: '',
      },
    });

    const result = fileState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('file slash state');
    expect(sm.pointer).toBe(2);
    expect(sm.url.scheme).toBe('file');
    expect(sm.validationError).toBe(false);
  });

  it('should handle "\\" character', () => {
    const sm = createStateMachine({
      input: 'C:\\\\localhost',
      buffer: '',
      pointer: 2,
      state: 'file state',
      url: {
        scheme: '',
      },
    });

    const result = fileState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('file slash state');
    expect(sm.pointer).toBe(2);
    expect(sm.url.scheme).toBe('file');
    expect(sm.validationError).toBe(true);
  });

  it('should handle "EOF" with base scheme equal to file', () => {
    const sm = createStateMachine({
      input: '',
      buffer: '',
      pointer: 0,
      state: 'file state',
      url: {
        scheme: '',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
      },
    });

    const result = fileState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('file state');
    expect(sm.pointer).toBe(0);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual(sm.base.path);
    expect(sm.url.query).toBe(sm.base.query);
    expect(sm.url.fragment).toBe(null);
    expect(sm.validationError).toBe(false);
  });

  it('should handle "?" with base scheme equal to file', () => {
    const sm = createStateMachine({
      input: '?',
      buffer: '',
      pointer: 0,
      state: 'file state',
      url: {
        scheme: '',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('query state');
    expect(sm.pointer).toBe(0);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual(sm.base.path);
    expect(sm.url.query).toBe('');
    expect(sm.url.fragment).toBe(null);
    expect(sm.validationError).toBe(false);
  });

  it('should handle "#" with base scheme equal to file', () => {
    const sm = createStateMachine({
      input: '#',
      buffer: '',
      pointer: 0,
      state: 'file state',
      url: {
        scheme: '',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('fragment state');
    expect(sm.pointer).toBe(0);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual(sm.base.path);
    expect(sm.url.query).toBe(sm.base.query);
    expect(sm.url.fragment).toBe('');
    expect(sm.validationError).toBe(false);
  });

  it('should handle "path character" with base scheme equal to file', () => {
    const sm = createStateMachine({
      input: 'path',
      buffer: '',
      pointer: 0,
      state: 'file state',
      url: {
        scheme: '',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileState(sm, 'p');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBe(sm.base.host);
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(false);
  });

  it('should handle "windows drive letter" with base scheme equal to file', () => {
    const sm = createStateMachine({
      input: 'c://test',
      buffer: '',
      pointer: 0,
      state: 'file state',
      url: {
        scheme: '',
      },

      base: {
        scheme: 'file',
        host: 'localhost',
        path: ['foo'],
        query: 'q',
        fragment: 'f',
      },
    });

    const result = fileState(sm, 'C');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.url.host).toBeNull();
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBeNull();
    expect(sm.url.fragment).toBeNull();
    expect(sm.validationError).toBe(true);
  });

  it('should handle other character without base', () => {
    const sm = createStateMachine({
      input: 'path',
      buffer: '',
      pointer: 0,
      state: 'file state',
      url: {
        scheme: '',
      },
    });

    const result = fileState(sm, 'p');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('path state');
    expect(sm.pointer).toBe(-1);
    expect(sm.url.scheme).toBe('file');
    expect(sm.validationError).toBe(false);
  });
});
