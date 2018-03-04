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

import {size} from '../../../../lang/size';
import {isNormalizedWindowsDriveLetter} from './is-normalized-windows-drive-letter';

/**
 * Shorten URL path.
 *
 * @param {Object} url Input URL.
 * @return {void}
 * @see https://url.spec.whatwg.org/#shorten-a-urls-path
 */
export function shortenUrlPath(url) {
  // 1- Let path be url’s path.
  const path = url.path;
  const pathSize = size(path);

  // 2- If path is empty, then return.
  if (pathSize === 0) {
    return;
  }

  // 3- If url’s scheme is "file", path’s size is 1, and path[0] is a normalized Windows drive letter, then return.
  if (url.scheme === 'file' && pathSize === 1 && isNormalizedWindowsDriveLetter(path[0])) {
    return;
  }

  // 4- Remove path’s last item.
  path.pop();
}
