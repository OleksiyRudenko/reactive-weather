import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import SearchBar from './components/SearchBar';
import {SettingsService} from "./services/SettingsService";
import {WeatherService} from "./services/WeatherService";
import * as dom from './utils/dom.js';

class App extends Component {
  constructor(props={}) {
    super(props);
    dom.bindHandlers(this, 'handleLocation');
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
        <SearchBar locationHandler={this.handleLocation} />
      </div>
    );
  }

  /**
   * Handles location supplied by outer components
   * @param {string} location {cityname|latlon}
   * @private
   */
  handleLocation(location) {
    console.log('APP.handleLocation', location);
    this._getWeather(location);
  }

  _getWeather(location) {
    const inputType = /^[-\d\s,.]+$/.test(location) ? 'latlon' : 'cityname';
    let query = {};

    switch (inputType) {
      case 'cityname':
        query = { q: location};
        break;
      case 'latlon':
        const coordComponents = location.split(/[\s,]/);
        query = {
          lon: coordComponents[0],
          lat: coordComponents[coordComponents.length-1],
        };
        break;
      // no default
    }
    // add units explicitly
    SettingsService.units.then(units => {
      query.units = units;
      console.log('App.getWeather query', query);
      WeatherService.getCurrentWeather(inputType, query).then(console.log);
      WeatherService.getWeatherForecast(inputType, query).then(console.log);
    });
  }
}

export default App;
