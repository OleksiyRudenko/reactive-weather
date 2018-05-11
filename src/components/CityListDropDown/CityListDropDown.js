import React, { Component } from 'react';
import './CityListDropDown.css';
import {FavCityService} from '../../services/FavCityService';
import {CityHistoryService} from '../../services/CityHistoryService';
import CityListDropDownEntry from '../CityListDropDownEntry';
import * as dom from '../../utils/dom.js';

export default class CityListDropDown extends Component {
  constructor(props={}) {
    super(props);
    dom.bindHandlers(this);
    this.state = {
      list: null,
    };
    this._populateLists();
    dom.bindHandlers(this, '_handleUserKey', '_handleClick');
  }

  /**
   * Renders CityListDropDown component
   * @returns {string}
   */
  render() {
    if (!this.state.list) return null;
    // console.log('CLDD.render: props=', this.props);
    return (
      <div className='city-list-dd-container' onKeyUp={this._handleUserKey} onClick={this._handleClick}>
          {this.state.list.map((item,idx) => <CityListDropDownEntry icon={item.icon} text={item.text} key={idx.toString()} id={idx} setFocus={this.props.activateMe && !idx} />)}
      </div>
    );
  }

  /**
   * Populates state with lists
   * @private
   */
  _populateLists() {
    const icons = ['star', 'history'];
    Promise.all([this._getFavourites(),this._getHistory()]).then(lists => {
      // remove favourites from history
      const listHistory = lists[1].filter(entry => !lists[0].includes(entry));
      // add favourites and history
      this.setState({
        list : [].concat(
          lists[0].map(entry => ({text:entry, icon:icons[0]})),
          listHistory.map(entry => ({text:entry, icon:icons[1]}))
        ),
      });
    });
  }

  /**
   * Get favourite cities
   * @returns {Promise}
   * @private
   */
  _getFavourites() {
    return FavCityService.getItems();
  }

  /**
   * Get city search history
   * @returns {Promise}
   */
  _getHistory() {
    return CityHistoryService.getItems();
  }

  /**
   * Handles mouse clicks
   * @param ev
   * @private
   */
  _handleClick(ev) {
    if (ev.target.type === 'radio' && ev.nativeEvent.x && ev.nativeEvent.y) {
      // console.log('CLDD.click', ev.target, ev, ev.keyCode, ev.nativeEvent);
      this.props.handleSelection(ev.target.value);
    }
  }

  /**
   * Handles special keys
   * @param ev
   * @private
   */
  _handleUserKey(ev) {
    // console.log('CLDD.userkey', ev.target);
    switch (ev.keyCode) {
      case 27:
        this.props.hideMeBy();
        break;
      case 13:
        this.props.handleSelection(ev.target.value);
        break;
      // no default
    }
  }
}
