import React, { Component } from 'react';
import './CityListDropDown.css';
import {FavCityService} from '../../services/FavCityService';
import {CityHistoryService} from '../../services/CityHistoryService';
import * as dom from '../../utils/dom.js';

export default class CityListDropDown extends Component {
  constructor(props={}) {
    super(props);
    dom.bindHandlers(this);
    this.state = {
      list: null,
    };
    this._populateLists();
    dom.bindHandlers(this, '_handleUserInput');
  }

  /**
   * Renders CityListDropDown component
   * @returns {string}
   */
  render() {
    if (!this.state.list) return null;
    return (
      <div className='city-list-dd-container' onKeyUp={this._handleUserInput}>
          {this.state.list.map((item,idx) => <ListItem icon={item.icon} text={item.text} key={idx.toString()} id={idx} />)}
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

  _handleUserInput(ev) {
    switch (ev.keyCode) {
      case 27:
        this.props.hideMe();
        break;
      // no default
    }
  }

}

/**
 * Render a list item
 * REF: Focusing https://stackoverflow.com/questions/28889826/react-set-focus-on-input-after-render
 * REF: Focusing https://reactjs.org/docs/refs-and-the-dom.html
 * @param props
 * @returns {*}
 * @constructor
 */
function ListItem(props) {
  return (
    <label htmlFor={'city-list-dd-item-'+props.id}>
      <input type='radio' name='city-list-dd-selection' id={'city-list-dd-item-'+props.id} value={props.text}
             className='city-list-dd-item-radio' defaultChecked={!props.id}
             autoFocus={!props.id}
      />
      <div className='city-list-dd-item'><i className='material-icons'>{props.icon}</i>{props.text}</div>
    </label>
  );
}
