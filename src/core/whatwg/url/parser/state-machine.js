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

import {isNull} from '../../../lang/is-null';
import {isFunction} from '../../../lang/is-function';
import {getOutputEncoding} from './common/get-output-encoding';
import {removeTabAndNewLine} from './common/remove-tab-and-new-line';
import {trimControlChars} from './common/trim-control-chars';
import {FAILURE} from './common/failure';

import {authorityState} from './states/authority-state';
import {cannotBeABaseURLPathState} from './states/cannot-be-a-base-url-path-state';
import {fileState} from './states/file-state';
import {fileSlashState} from './states/file-slash-state';
import {fragmentState} from './states/fragment-state';
import {hostState} from './states/host-state';
import {noSchemeState} from './states/no-scheme-state';
import {pathOrAuthorityState} from './states/path-or-authority-state';
import {pathStartState} from './states/path-start-state';
import {portState} from './states/port-state';
import {relativeState} from './states/relative-state';
import {relativeSlashState} from './states/relative-slash-state';
import {schemeStartState} from './states/scheme-start-state';
import {schemeState} from './states/scheme-state';
import {specialAuthoritySlashesState} from './states/special-authority-slashes-state';
import {specialAuthorityIgnoreSlashesState} from './states/special-authority-ignore-slashes-state';
import {specialRelativeOrAuthorityState} from './states/special-relative-or-authority-state';

import {newEmptyUrl} from './url';

import {
  AUTHORITY_STATE,
  CANNOT_BE_A_BASE_URL_PATH_STATE,
  FILE_STATE,
  FILE_SLASH_STATE,
  FRAGMENT_STATE,
  HOST_STATE,
  HOSTNAME_STATE,
  NO_SCHEME_STATE,
  PATH_OR_AUTHORITY_STATE,
  PATH_START_STATE,
  PORT_STATE,
  RELATIVE_STATE,
  RELATIVE_SLASH_STATE,
  SCHEME_START_STATE,
  SCHEME_STATE,
  SPECIAL_AUTHORITY_SLASHES_STATE,
  SPECIAL_AUTHORITY_IGNORE_SLAHES_STATE,
  SPECIAL_RELATIVE_OR_AUTHORITY_STATE,
} from './states/states';

const STATES = {
  [AUTHORITY_STATE]: authorityState,
  [CANNOT_BE_A_BASE_URL_PATH_STATE]: cannotBeABaseURLPathState,
  [FILE_STATE]: fileState,
  [FILE_SLASH_STATE]: fileSlashState,
  [FRAGMENT_STATE]: fragmentState,
  [HOST_STATE]: hostState,
  [HOSTNAME_STATE]: hostState,
  [NO_SCHEME_STATE]: noSchemeState,
  [PATH_OR_AUTHORITY_STATE]: pathOrAuthorityState,
  [PATH_START_STATE]: pathStartState,
  [PORT_STATE]: portState,
  [RELATIVE_STATE]: relativeState,
  [RELATIVE_SLASH_STATE]: relativeSlashState,
  [SCHEME_START_STATE]: schemeStartState,
  [SCHEME_STATE]: schemeState,
  [SPECIAL_AUTHORITY_SLASHES_STATE]: specialAuthoritySlashesState,
  [SPECIAL_AUTHORITY_IGNORE_SLAHES_STATE]: specialAuthorityIgnoreSlashesState,
  [SPECIAL_RELATIVE_OR_AUTHORITY_STATE]: specialRelativeOrAuthorityState,
};

/**
 * The URL parser state machine.
 * @class
 * @see https://url.spec.whatwg.org/#concept-url-parser
 */
export class StateMachine {
  /**
   * Create the URL parser.
   *
   * @param {string} input The input URL.
   * @param {string} base Optional base URL.
   * @param {string} encodingOverride Optional encoding.
   * @param {Object} url Optional URL.
   * @param {string} stateOverride Optional state.
   * @constructor
   */
  constructor(input, base = null, encodingOverride = null, url = null, stateOverride = null) {
    this.input = input;
    this.url = url;
    this.validationError = false;

    this.stateOverride = stateOverride;

    // 1- If url is not given:
    if (isNull(this.url)) {
      // 1.1- Set url to a new URL.
      this.url = newEmptyUrl();

      // 1.2- If input contains any leading or trailing C0 control or space, validation error.
      // 1.3- Remove any leading and trailing C0 control or space from input.
      const trimmedInput = trimControlChars(this.input);
      if (trimmedInput !== this.input) {
        this.validationError = true;
        this.input = trimmedInput;
      }
    }

    // 2- If input contains any ASCII tab or newline, validation error.
    // 3- Remove all ASCII tab or newline from input.
    const result = removeTabAndNewLine(this.input);
    if (result !== this.input) {
      this.validationError = true;
      this.input = result;
    }

    // 4- Let state be state override if given, or scheme start state otherwise.
    this.state = isNull(stateOverride) ? 'scheme start state' : stateOverride;

    // 5- If base is not given, set it to null.
    this.base = base;

    // 6- Let encoding be UTF-8.
    this.encoding = 'UTF-8';

    // 7- If encoding override is given, set encoding to the result of getting an output encoding
    // from encoding override.
    if (!isNull(encodingOverride)) {
      this.encoding = getOutputEncoding(encodingOverride);
    }

    // 8- Let buffer be the empty string.
    this.buffer = '';

    // 9- Let the @ flag, [] flag, and passwordTokenSeenFlag be unset.
    this.atFlag = false;
    this.arrFlag = false;
    this.passwordTokenSeenFlag = false;

    // 10- Let pointer be a pointer to first code point in input.
    // Here, `this.pointer` will be the index of the current character.
    this.pointer = 0;

    // 11- Last step need to be triggered by the `execute` method.
  }

  /**
   * Execute the process algorithm describe in the specification.
   *
   * @return {void}
   */
  run() {
    // 11- Keep running the following state machine by switching on state.
    // If after a run pointer points to the EOF code point, go to the next step.
    // Otherwise, increase pointer by one and continue with the state machine.
    for (; this.pointer <= this.input.length; ++this.pointer) {
      const eof = this.pointer >= this.input.length;
      const c = eof ? undefined : this.input.charAt(this.pointer);
      const stateFn = STATES[this.state];
      if (!isFunction(stateFn)) {
        return;
      }

      const stateResult = stateFn(this, c);
      if (stateResult === FAILURE) {
        return FAILURE;
      }
    }
  }
}
