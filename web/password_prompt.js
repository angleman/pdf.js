/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals PDFJS, mozL10n */

'use strict';

var PasswordPrompt = {
  visible: false,
  updatePassword: null,
  reason: null,
  overlayContainer: null,
  passwordField: null,
  passwordText: null,
  passwordSubmit: null,
  passwordCancel: null,

  initialize: function secondaryToolbarInitialize(options) {
    this.overlayContainer = options.overlayContainer;
    this.passwordField = options.passwordField;
    this.passwordText = options.passwordText;
    this.passwordSubmit = options.passwordSubmit;
    this.passwordCancel = options.passwordCancel;

    // Attach the event listeners.
    this.passwordSubmit.addEventListener('click',
      this.verifyPassword.bind(this));

    this.passwordCancel.addEventListener('click', this.hide.bind(this));

    this.passwordField.addEventListener('keydown',
      function (e) {
        if (e.keyCode === 13) { // Enter key
          this.verifyPassword();
        }
      }.bind(this));

    this.overlayContainer.addEventListener('keydown',
      function (e) {
        if (e.keyCode === 27) { // Esc key
          this.hide();
        }
      }.bind(this));
  },

  show: function passwordPromptShow() {
    if (this.visible) {
      return;
    }
    this.visible = true;
    this.overlayContainer.classList.remove('hidden');
    this.overlayContainer.firstElementChild.classList.remove('hidden');
    this.passwordField.focus();

    var promptString = mozL10n.get('password_label', null,
      'Enter the password to open this PDF file.');

    if (this.reason === PDFJS.PasswordResponses.INCORRECT_PASSWORD) {
      promptString = mozL10n.get('password_invalid', null,
        'Invalid password. Please try again.');
    }

    this.passwordText.textContent = promptString;
  },

  hide: function passwordPromptClose() {
    if (!this.visible) {
      return;
    }
    this.visible = false;
    this.passwordField.value = '';
    this.overlayContainer.classList.add('hidden');
    this.overlayContainer.firstElementChild.classList.add('hidden');
  },

  verifyPassword: function passwordPromptVerifyPassword() {
    var password = this.passwordField.value;
    if (password && password.length > 0) {
      this.hide();
      return this.updatePassword(password);
    }
  }
};
