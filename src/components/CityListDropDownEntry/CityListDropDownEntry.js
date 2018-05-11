import React, { Component } from 'react';
import './CityListDropDownEntry.css';

export default class CityListDropDown extends Component {
  render() {
    const props = this.props;
    // console.log('CLDDE.render', this.props);
    return (
      <label htmlFor={'city-list-dd-item-'+props.id}>
        <input type='radio' name='city-list-dd-selection' id={'city-list-dd-item-'+props.id} value={props.text}
               className='city-list-dd-item-radio' defaultChecked={!props.id}
               ref={element => this.inputControl = element}
        />
        <div className='city-list-dd-item'><i className='material-icons'>{props.icon}</i>{props.text}</div>
      </label>
    );
  }
  componentDidMount() {
    this.props.setFocus && this.inputControl.focus();
  }

  componentDidUpdate() {
    this.props.setFocus && this.inputControl.focus();
  }
}
