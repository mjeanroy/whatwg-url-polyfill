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
import {StateMachine} from 'src/core/whatwg/url/parser/state-machine';

describe('StateMachine', () => {
  it('should initialize state machine', () => {
    const input = 'http://localhost:8080';
    const sm = new StateMachine(input);

    expect(sm.input).toBe(input);
    expect(sm.validationError).toBe(false);
    expect(sm.state).toBe('scheme start state');
    expect(sm.encoding).toBe('UTF-8');
    expect(sm.base).toBeNull();
    expect(sm.pointer).toBe(0);
    expect(sm.buffer).toBe('');
    expect(sm.atFlag).toBe(false);
    expect(sm.arrFlag).toBe(false);
    expect(sm.passwordTokenSeenFlag).toBe(false);
    expect(sm.url).toEqual({
      scheme: '',
      username: '',
      password: '',
      host: null,
      port: null,
      path: [],
      query: null,
      fragment: null,
    });
  });

  it('should initialize state machine with untrimmed input', () => {
    const trimmedInput = 'http://localhost:8080';
    const input = `  ${trimmedInput}  `;
    const sm = new StateMachine(input);

    expect(sm.input).toBe(trimmedInput);
    expect(sm.validationError).toBe(true);
  });

  it('should initialize state machine with input containing tab', () => {
    const TAB = String.fromCharCode(0x0009);
    const scheme = 'http';
    const host = 'localhost';
    const port = '8080';
    const input = `${scheme}://${host}${TAB}:${TAB}${port}`;
    const sm = new StateMachine(input);

    expect(sm.input).toBe(`${scheme}://${host}:${port}`);
    expect(sm.validationError).toBe(true);
  });

  it('should initialize state machine with overriding state', () => {
    const sm = new StateMachine('http://localhost:8080', null, null, null, 'scheme state');
    expect(sm.stateOverride).toBe('scheme state');
    expect(sm.state).toBe('scheme state');
  });

  describe('once initialized', () => {
    it('should parse http scheme', () => {
      const sm = new StateMachine('http://localhost:8080');
      const result = sm.run();

      expect(result).not.toBe(FAILURE);
      expect(sm.url.scheme).toBe('http');
      expect(sm.url.username).toBe('');
      expect(sm.url.password).toBe('');
      expect(sm.url.host).toBe('localhost');
    });

    it('should parse http scheme with credentials', () => {
      const sm = new StateMachine('http://foo:bar@localhost:8080');
      const result = sm.run();

      expect(result).not.toBe(FAILURE);
      expect(sm.url.scheme).toBe('http');
      expect(sm.url.username).toBe('foo');
      expect(sm.url.password).toBe('bar');
      expect(sm.url.host).toBe('localhost');
    });

    it('should parse https scheme', () => {
      const sm = new StateMachine('https://localhost:8080');
      const result = sm.run();

      expect(result).not.toBe(FAILURE);
      expect(sm.url.scheme).toBe('https');
      expect(sm.url.username).toBe('');
      expect(sm.url.password).toBe('');
      expect(sm.url.host).toBe('localhost');
    });

    it('should parse ws scheme', () => {
      const sm = new StateMachine('ws://localhost:8080');
      const result = sm.run();

      expect(result).not.toBe(FAILURE);
      expect(sm.url.scheme).toBe('ws');
      expect(sm.url.username).toBe('');
      expect(sm.url.password).toBe('');
      expect(sm.url.host).toBe('localhost');
    });

    it('should parse wss scheme', () => {
      const sm = new StateMachine('wss://localhost:8080');
      const result = sm.run();

      expect(result).not.toBe(FAILURE);
      expect(sm.url.scheme).toBe('wss');
      expect(sm.url.username).toBe('');
      expect(sm.url.password).toBe('');
      expect(sm.url.host).toBe('localhost');
    });
  });
});
