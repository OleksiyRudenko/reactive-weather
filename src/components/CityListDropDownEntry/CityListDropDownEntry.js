import React, { Component } from 'react';
import './CityListDropDownEntry.css';

export default class CityListDropDown extends Component {
  render() {
    const props = this.props;
    console.log('CLDDE.render', this.props, !props.id && props.setFocus);
    return (
      <label htmlFor={'city-list-dd-item-'+props.id}>
        <input type='radio' name='city-list-dd-selection' id={'city-list-dd-item-'+props.id} defaultValue={props.text}
               className='city-list-dd-item-radio' defaultChecked={props.setFocus} autoFocus={props.setFocus}
               ref={element => this.inputControl = element}
        />
        <div className='city-list-dd-item'><i className='material-icons'>{props.icon}</i> {props.text}</div>
      </label>
    );
  }
  componentDidMount() {
    console.log('CLDDE.didMount', this.props, this.inputControl, this.inputControl.focus);
    this.props.setFocus && this.inputControl.focus();
  }

  componentDidUpdate() {
    console.log('CLDDE.didUpdate', this.props, this.inputControl, this.inputControl.focus);
    this.props.setFocus && this.inputControl.focus();
  }
}
