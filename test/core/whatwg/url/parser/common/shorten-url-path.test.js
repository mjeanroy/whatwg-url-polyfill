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

import {shortenUrlPath} from 'src/core/whatwg/url/parser/common/shorten-url-path';

describe('shortenUrlPath', () => {
  it('should not do anything with path equal to null', () => {
    const url = {
      scheme: 'http',
      path: null,
    };

    shortenUrlPath(url);
    expect(url.path).toBeNull();
  });

  it('should not do anything with path equal to undefined', () => {
    const url = {
      scheme: 'http',
      path: undefined,
    };

    shortenUrlPath(url);
    expect(url.path).not.toBeDefined();
  });

  it('should not do anything with path equal to empty array', () => {
    const url = {
      scheme: 'http',
      path: [],
    };

    shortenUrlPath(url);
    expect(url.path).toEqual([]);
  });

  it('should remove last path parts', () => {
    const url = {
      scheme: 'http',
      path: ['foo', 'bar', 'quiz'],
    };

    shortenUrlPath(url);
    expect(url.path).toEqual(['foo', 'bar']);
  });

  it('should remove single path part if scheme is not file', () => {
    const url = {
      scheme: 'http',
      path: ['foo'],
    };

    shortenUrlPath(url);
    expect(url.path).toEqual([]);
  });

  it('should remove single path part if scheme is file, path[0] is a normalized windows drive letter but path size > 1', () => {
    const url = {
      scheme: 'file',
      path: ['C:', 'test'],
    };

    shortenUrlPath(url);
    expect(url.path).toEqual(['C:']);
  });

  it('should not remove single path part if scheme is file and path is a normalized windows drive letter', () => {
    const url = {
      scheme: 'file',
      path: ['C:'],
    };

    shortenUrlPath(url);
    expect(url.path).toEqual(['C:']);
  });

  it('should remove single path part if scheme is file but path is not a normalized windows drive letter', () => {
    const url = {
      scheme: 'file',
      path: ['test'],
    };

    shortenUrlPath(url);
    expect(url.path).toEqual([]);
  });
});
