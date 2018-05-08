import React, { Component } from 'react';
import './SearchBar.css';
import * as text from '../../utils/text.js';
import * as dom from '../../utils/dom.js';

export default class SearchBar extends Component {
  constructor(props = {}) {
    super(props);
    this.state = {
      searchTerm: '',
      actionDisabled: true,
    };
    dom.bindHandlers(this, '_handleSearchAction', '_handleUserInput', '_handleUserInputFocus');
  }

  /**
   * Renders SearchBar component
   * @returns {string}
   */
  render() {
    return (
      <form className="search-bar-form" onSubmit={this._handleSearchAction}>
        {this._renderUserInput()}
        {this._renderActionButton()}
      </form>
    );
  }

  /**
   * Renders Text Input field
   * @returns {string}
   * @private
   */
  _renderUserInput() {
    return (
      <input type="text" className="search-bar-input" value={this.state.searchTerm}
             required="true"
             minLength="3"
             maxLength="20"
             inputMode="verbatim"
             placeholder="Kyiv | 50.2,30.1"
             title="Tap me and type!"
             onInput={this._handleUserInput}
             onFocus={this._handleUserInputFocus}
      />
    );
  }

  /**
   * Renders Search Action Button
   * @returns {string}
   * @private
   */
  _renderActionButton() {
    return (
      <button type="button" className="search-bar-action"
              title="Get weather info"
              disabled={this.state.actionDisabled}
              onClick={this._handleSearchAction}
      >
        <i className="material-icons">search</i>
      </button>
    );
  }

  /**
   * Handles user input
   * @param {Event} ev
   * @private
   */
  _handleUserInput(ev) {
    const target = ev.target;
    if (ev.keyCode === 13) {
      console.log('ENTER pressed');
      ev.preventDefault();
      ev.stopPropagation();

      target.value = text.sanitizeWhitespaces(target.value, true);

      this.setState({
        searchTerm: target.value,
        actionDisabled: target.value.length < 3,
      });

      this._handleSearchAction();
    }

    // remove letters if input value starts with [-.\d] as an indication of geocoords input
    if (target.value.length > 0 && /^[-\d.,]/.test(target.value)) {
      target.value = target.value.replace(/[^-\d.,\s]/g,'');
    }
    target.value = text.sanitizeWhitespaces(target.value);

    this.setState({
      searchTerm: target.value,
      actionDisabled: target.value.length < 3,
    });
  }

  /**
   * Handles User Input onFocus event
   * @param {Event} ev
   * @private
   */
  _handleUserInputFocus(ev) {
    const target = ev.target;
    target.setSelectionRange(0, target.value.length);
  }

  /**
   * Handles search action
   * @param {Event} ev
   * @private
   */
  _handleSearchAction(ev = null) {
    if (ev) {
      ev.preventDefault();
      ev.nativeEvent.stopImmediatePropagation();
      ev.stopPropagation();
    }
    if (!this.state.actionDisabled) {
      console.log('Search for "' + this.state.searchTerm + '" on', ev?ev:null);
    }
  }
}
