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
import {noSchemeState} from 'src/core/whatwg/url/parser/states/no-scheme-state';
import {createStateMachine} from './create-state-machine';

describe('noSchemeState', () => {
  it('should return failure without base', () => {
    const sm = createStateMachine({
      input: '//localhost',
      buffer: '',
      pointer: 0,
    });

    const result = noSchemeState(sm, '/');

    expect(result).toBe(FAILURE);
    expect(sm.validationError).toBe(true);
    expect(sm.pointer).toBe(0);
    expect(sm.buffer).toBe('');
    expect(sm.url).toEqual({
      scheme: '',
      username: '',
      password: '',
      host: null,
      port: null,
      path: [],
      query: null,
      fragment: null,
      cannotBeABaseUrl: false,
    });
  });

  it('should return failure with base and without "#" character', () => {
    const sm = createStateMachine({
      input: '//localhost',
      buffer: '',
      pointer: 0,
      base: {
        cannotBeABaseUrl: true,
      },
    });

    const result = noSchemeState(sm, '/');

    expect(result).toBe(FAILURE);
    expect(sm.validationError).toBe(true);
    expect(sm.pointer).toBe(0);
    expect(sm.buffer).toBe('');
    expect(sm.url).toEqual({
      scheme: '',
      username: '',
      password: '',
      host: null,
      port: null,
      path: [],
      query: null,
      fragment: null,
      cannotBeABaseUrl: false,
    });
  });

  it('should parse with base and with "#" character', () => {
    const sm = createStateMachine({
      input: '#localhost',
      buffer: '',
      pointer: 0,
      base: {
        scheme: 'http',
        path: ['/', 'foo'],
        query: 's',
        fragment: 'frag',
        cannotBeABaseUrl: true,
      },
    });

    const result = noSchemeState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.validationError).toBe(false);
    expect(sm.pointer).toBe(0);
    expect(sm.buffer).toBe('');
    expect(sm.url.scheme).toBe('http');
    expect(sm.url.path).not.toBe(sm.base.path);
    expect(sm.url.path).toEqual(['/', 'foo']);
    expect(sm.url.query).toBe('s');
    expect(sm.url.fragment).toBe('');
    expect(sm.url.cannotBeABaseUrl).toBe(true);
    expect(sm.state).toBe('fragment state');
  });

  it('should parse with base, without "#" character and without cannotBeABaseUrl', () => {
    const sm = createStateMachine({
      input: '//localhost',
      buffer: '',
      pointer: 0,
      base: {
        scheme: 'http',
        path: ['/', 'foo'],
        query: 's',
        fragment: 'frag',
        cannotBeABaseUrl: false,
      },
    });

    const result = noSchemeState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.validationError).toBe(false);
    expect(sm.pointer).toBe(-1);
    expect(sm.buffer).toBe('');
    expect(sm.url.scheme).toBe('');
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBe(null);
    expect(sm.url.fragment).toBe(null);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.state).toBe('relative state');
  });

  it('should parse with base, without "#" character and without file scheme', () => {
    const sm = createStateMachine({
      input: '//localhost',
      buffer: '',
      pointer: 0,
      base: {
        scheme: 'file',
        cannotBeABaseUrl: false,
      },
    });

    const result = noSchemeState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.validationError).toBe(false);
    expect(sm.pointer).toBe(-1);
    expect(sm.buffer).toBe('');
    expect(sm.url.scheme).toBe('');
    expect(sm.url.path).toEqual([]);
    expect(sm.url.query).toBe(null);
    expect(sm.url.fragment).toBe(null);
    expect(sm.url.cannotBeABaseUrl).toBe(false);
    expect(sm.state).toBe('file state');
  });
});
