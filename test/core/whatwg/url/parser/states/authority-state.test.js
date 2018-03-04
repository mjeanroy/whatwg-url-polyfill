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

import _forEach from 'lodash.foreach';
import {FAILURE} from 'src/core/whatwg/url/parser/common/failure';
import {authorityState} from 'src/core/whatwg/url/parser/states/authority-state';
import {createStateMachine} from './create-state-machine';

describe('pathOrAuthorityState', () => {
  it('should parse "/" character', () => {
    const sm = createStateMachine({
      input: 'http://foo:bar@localhost:8080',
      buffer: 'http://f',
      pointer: 8,
      state: 'authority state',
    });

    const result = authorityState(sm, 'o');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('authority state');
    expect(sm.pointer).toBe(8);
    expect(sm.buffer).toBe('http://fo');
    expect(sm.atFlag).toBe(false);
    expect(sm.passwordTokenSeenFlag).toBe(false);
    expect(sm.validationError).toBe(false);
  });

  it('should parse "@" character when password is not set', () => {
    const sm = createStateMachine({
      input: 'http://foo@localhost:8080',
      buffer: 'foo',
      pointer: 10,
      state: 'authority state',
    });

    const result = authorityState(sm, '@');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('authority state');
    expect(sm.pointer).toBe(10);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(true);
    expect(sm.passwordTokenSeenFlag).toBe(false);
    expect(sm.validationError).toBe(true);
    expect(sm.url.username).toBe('foo');
    expect(sm.url.password).toBe('');
  });

  it('should parse "@" character when password is set', () => {
    const sm = createStateMachine({
      input: 'http://foo:bar@localhost:8080',
      buffer: 'foo:bar',
      pointer: 14,
      state: 'authority state',
    });

    const result = authorityState(sm, '@');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('authority state');
    expect(sm.pointer).toBe(14);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(true);
    expect(sm.passwordTokenSeenFlag).toBe(true);
    expect(sm.validationError).toBe(true);
    expect(sm.url.username).toBe('foo');
    expect(sm.url.password).toBe('bar');
  });

  it('should parse "@" character and percent-encode fragment-character-set', () => {
    const fragmentCharacterSet = {
      ' ': '%20',
      '"': '%22',
      '<': '%3C',
      '>': '%3E',
      '`': '%60',
    };

    _forEach(fragmentCharacterSet, (percentEncoded, ch) => {
      const sm = createStateMachine({
        input: `http://foo${ch}bar@localhost:8080`,
        buffer: `foo${ch}bar`,
        pointer: 14,
        state: 'authority state',
      });

      const result = authorityState(sm, '@');

      expect(result).not.toBe(FAILURE);
      expect(sm.url.username).toBe(`foo${percentEncoded}bar`);
      expect(sm.url.password).toBe('');
    });
  });

  it('should parse "@" character and percent-encode path-character-set', () => {
    const pathCharacterSet = {
      '#': '%23',
      '?': '%3F',
      '{': '%7B',
      '}': '%7D',
    };

    _forEach(pathCharacterSet, (percentEncoded, ch) => {
      const sm = createStateMachine({
        input: `http://foo${ch}bar@localhost:8080`,
        buffer: `foo${ch}bar`,
        pointer: 14,
        state: 'authority state',
      });

      const result = authorityState(sm, '@');

      expect(result).not.toBe(FAILURE);
      expect(sm.url.username).toBe(`foo${percentEncoded}bar`);
      expect(sm.url.password).toBe('');
    });
  });

  it('should parse "@" character and percent-encode user-info-character-set', () => {
    const userInfoCharacterSet = {
      '/': '%2F',
      ':': '%3A',
      ';': '%3B',
      '=': '%3D',
      '@': '%40',
      '[': '%5B',
      '\\': '%5C',
      ']': '%5D',
      '^': '%5E',
      '|': '%7C',
    };

    _forEach(userInfoCharacterSet, (percentEncoded, ch) => {
      const sm = createStateMachine({
        input: `http://foo:bar${ch}quiz@localhost:8080`,
        buffer: `foo:bar${ch}quiz`,
        pointer: 19,
        state: 'authority state',
      });

      const result = authorityState(sm, '@');

      expect(result).not.toBe(FAILURE);
      expect(sm.url.username).toBe(`foo`);
      expect(sm.url.password).toBe(`bar${percentEncoded}quiz`);
    });
  });

  it('should parse "/" character when atFlag has not been set', () => {
    const sm = createStateMachine({
      input: 'http://foo/test',
      buffer: 'foo',
      pointer: 10,
      state: 'authority state',
    });

    const result = authorityState(sm, '/');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(6);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(false);
    expect(sm.validationError).toBe(false);
    expect(sm.url.username).toBe('');
    expect(sm.url.password).toBe('');
  });

  it('should parse "/" character when atFlag has been set', () => {
    const sm = createStateMachine({
      input: 'http://@/test',
      buffer: '',
      pointer: 8,
      state: 'authority state',
      atFlag: true,
    });

    const result = authorityState(sm, '/');

    expect(result).toBe(FAILURE);
    expect(sm.validationError).toBe(true);
  });

  it('should parse "?" character when atFlag has not been set', () => {
    const sm = createStateMachine({
      input: 'http://foo?test',
      buffer: 'foo',
      pointer: 10,
      state: 'authority state',
    });

    const result = authorityState(sm, '?');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(6);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(false);
    expect(sm.validationError).toBe(false);
    expect(sm.url.username).toBe('');
    expect(sm.url.password).toBe('');
  });

  it('should parse "?" character when atFlag has been set', () => {
    const sm = createStateMachine({
      input: 'http://@?test',
      buffer: '',
      pointer: 8,
      state: 'authority state',
      atFlag: true,
    });

    const result = authorityState(sm, '?');

    expect(result).toBe(FAILURE);
    expect(sm.validationError).toBe(true);
  });

  it('should parse "#" character when atFlag has not been set', () => {
    const sm = createStateMachine({
      input: 'http://foo#test',
      buffer: 'foo',
      pointer: 10,
      state: 'authority state',
    });

    const result = authorityState(sm, '#');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(6);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(false);
    expect(sm.validationError).toBe(false);
    expect(sm.url.username).toBe('');
    expect(sm.url.password).toBe('');
  });

  it('should parse "#" character when atFlag has been set', () => {
    const sm = createStateMachine({
      input: 'http://@#test',
      buffer: '',
      pointer: 8,
      state: 'authority state',
      atFlag: true,
    });

    const result = authorityState(sm, '#');

    expect(result).toBe(FAILURE);
    expect(sm.validationError).toBe(true);
  });

  it('should parse "EOF" character when atFlag has not been set', () => {
    const sm = createStateMachine({
      input: 'http://foo',
      buffer: 'foo',
      pointer: 10,
      state: 'authority state',
    });

    const result = authorityState(sm, undefined);

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(6);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(false);
    expect(sm.validationError).toBe(false);
    expect(sm.url.username).toBe('');
    expect(sm.url.password).toBe('');
  });

  it('should parse "EOF" character when atFlag has been set', () => {
    const sm = createStateMachine({
      input: 'http://@',
      buffer: '',
      pointer: 8,
      state: 'authority state',
      atFlag: true,
    });

    const result = authorityState(sm, undefined);

    expect(result).toBe(FAILURE);
    expect(sm.validationError).toBe(true);
  });

  it('should parse "\\" character when atFlag has not been set and with special URL', () => {
    const sm = createStateMachine({
      input: 'http://foo\\',
      buffer: 'foo',
      pointer: 10,
      state: 'authority state',
      url: {
        scheme: 'http',
      },
    });

    const result = authorityState(sm, '\\');

    expect(result).not.toBe(FAILURE);
    expect(sm.state).toBe('host state');
    expect(sm.pointer).toBe(6);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(false);
    expect(sm.validationError).toBe(false);
    expect(sm.url.username).toBe('');
    expect(sm.url.password).toBe('');
  });
});
