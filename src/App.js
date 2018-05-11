import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import SearchBar from './components/SearchBar';
import * as dom from './utils/dom.js';

class App extends Component {
  constructor(props={}) {
    super(props);
    dom.bindHandlers(this, '_handleLocation');
  }

  /**
   * Renders component
   * @returns {string}
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Weather app</h1>
        </header>
        <SearchBar locationHandler={this._handleLocation}/>
      </div>
    );
  }

  _handleLocation(location) {
    console.log('APP._handleLocation', location);
  }
}

export default App;
