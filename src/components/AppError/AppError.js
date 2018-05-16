import React, { Component } from 'react';
import './AppError.css';

export default class AppError extends Component {
  render() {
    return (<div className="app-error">
      <i className="wi wi-lightning app-error-icon"></i> {this.props.messages.map((msg,i) => <div className='app-error-message' key={'errMessage'+i}>{msg}</div>)}
    </div>);
  }
}
