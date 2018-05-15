import React, { Component } from 'react';
import './SearchBar.css';
import CityListDropDown from '../CityListDropDown';
import * as text from '../../utils/text.js';
import * as dom from '../../utils/dom.js';

export default class SearchBar extends Component {
  constructor(props = {}) {
    super(props);
    this.state = {
      searchTerm: this.props.searchTerm,
      actionDisabled: this.props.searchTerm.length < 3,
      showCityList: !this.props.searchTerm.length,
      activateCityList: false,
    };
    dom.bindHandlers(this, '_handleSearchAction', '_handleUserInput', '_handleUserKey', '_handleUserInputFocus', '_hideDropDown', '_handleInboundLocation');
    this.userInputRef = React.createRef();
  }

  /**
   * Renders SearchBar component
   * @returns {string}
   */
  render() {
    console.log('SB.render:', this.state);
    return (
      <div className="search-bar-container">
        <form className="search-bar-form" onSubmit={this._handleSearchAction} autoComplete="off" target="#">
          {this._renderUserInput()}
          {this._renderActionButton()}
          {this.state.showCityList && <CityListDropDown hideMeBy={this._hideDropDown} handleSelection={this._handleInboundLocation} activateMe={this.state.activateCityList} />}
        </form>
      </div>
    );
  }

  /**
   * Renders Text Input field
   * @returns {string}
   * @private
   */
  _renderUserInput() {
    // console.log('SB._renderUserInput state', this.state);
    return (
      <input type="text" className="search-bar-input" defaultValue={this.state.searchTerm}
             required="true"
             minLength="3"
             maxLength="20"
             inputMode="verbatim"
             placeholder="Kyiv | 50.2,30.1"
             title="Tap me and type!"
             autoFocus={true}
             onKeyUp={this._handleUserKey}
             onChange={this._handleUserInput}
             onFocus={this._handleUserInputFocus}
             ref={this.userInputRef}
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
    // console.log('SB.UI: value', target.value);

    // remove letters if input value starts with [-.\d] as an indication of geocoords input
    if (target.value.length > 0 && /^[-\d.,]/.test(target.value)) {
      target.value = target.value.replace(/[^-\d.,\sNSWEnswe]/g,''); // allow NSWE
    }
    target.value = text.sanitizeWhitespaces(target.value);

    this.setState({
      searchTerm: target.value,
      actionDisabled: target.value.length < 3,
      showCityList: !target.value.length,
      activateCityList: false,
    });
  }

  /**
   * Handles user input
   * @param {Event} ev
   * @private
   */
  _handleUserKey(ev) {
    // console.log('SB.UK:', 'Key event', ev, ev.target, 'value:', ev.target.value, ev.keyCode);
    switch (ev.keyCode) {
      /* case 13:
        // console.log('SB.UI: ENTER pressed');
        ev.preventDefault();
        ev.stopPropagation();
        target.value = text.sanitizeWhitespaces(target.value, true);
        this.setState({
          searchTerm: target.value,
          actionDisabled: target.value.length < 3,
        });
        this._handleSearchAction();
        break; */
      case 27:
        this._hideDropDown();
        break;
      case 40:
        // console.log('SB.UK: Pressed DOWN');
        this.setState({showCityList: true, activateCityList: true});
        break;
      // no default
    }
    // console.log('SB.UK: value', target.value);
  }

  /**
   * Handles location selection from other components
   * @param location
   * @private
   */
  _handleInboundLocation(location) {
    // console.log('SB._handleInboundLocation');
    this.userInputRef.current.value = location;
    this.setState({
      searchTerm: location,
      actionDisabled: location.length < 3,
    });
    this._hideDropDown();
    this.props.locationHandler(location);
  }

  /**
   * Hides city list dropdown
   * @private
   */
  _hideDropDown() {
    // console.log('SB: hide DD');
    this.userInputRef.current.focus();
    this.setState({showCityList:false, activateCityList: false});
  }

  /**
   * Handles User Input onFocus event
   * @param {Event} ev
   * @private
   */
  _handleUserInputFocus(ev) {
    const target = ev.target;
    target.setSelectionRange(0, target.value.length);
    this.setState({showCityList: !target.value.length, activateCityList: false});
  }

  /**
   * Handles search action
   * @param {Event} ev
   * @private
   */
  _handleSearchAction(ev = null) {
    // console.log('SB: submit');
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    const searchTerm = text.sanitizeWhitespaces(this.state.searchTerm, true);
    const actionDisabled = searchTerm.length < 3;
    this.setState({
      searchTerm,
      actionDisabled,
    });
    if (!actionDisabled) {
      // console.log('SB: Search for "' + searchTerm + '" on', ev?ev:null);
      this.props.locationHandler(searchTerm);
    }
  }

  /*
  componentWillUpdate(nextProps, nextState) {
    console.log('SB.willUpdate', nextProps, nextState);
    // nextState.searchTerm = nextProps.searchTerm;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('SB.willUpdate', prevProps, prevState);
    // nextState.searchTerm = nextProps.searchTerm;
  } */
}
