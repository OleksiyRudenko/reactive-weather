import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCurrent from './components/WeatherCurrent';
import {SettingsService} from "./services/SettingsService";
import {WeatherService} from "./services/WeatherService";
import {FavCityService} from "./services/FavCityService";
import * as dom from './utils/dom.js';

class App extends Component {
  constructor(props={}) {
    super(props);
    this.state = {
      weatherCurrent: null,
      weatherForecast: null,
    };
    dom.bindHandlers(this, 'handleLocation', 'handleUnitSwitch');
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
        {this.state.weatherCurrent && <WeatherCurrent data={this.state.weatherCurrent} unitSwitchHandler={this.handleUnitSwitch} />}
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
    this.setState({searchTerm:location});
    this._getWeather(location);
  }

  /**
   * Show weather
   * @param {string} location
   * @private
   */
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
      this._getCurrentWeather(inputType, query);
      WeatherService.getWeatherForecast(inputType, query).then(console.log);
    });
  }

  /**
   * Show current weather
   * @param {string} inputType {cityname|latlon}
   * @param {Object} query
   * @private
   */
  _getCurrentWeather(inputType, query) {
    this.setState({weatherCurrent: 'pending'});
    WeatherService.getCurrentWeather(inputType, query).then(data => setTimeout(() => {
      data.isFavCity = 'pending';
      this.setState({weatherCurrent: data});
      FavCityService.getItem(data.cityFull).then(result => {
        console.log('App._getCurrentWeather', result);
        data.isFavCity = result;
        this.setState({weatherCurrent: data});
      }).catch(e => console.error);
    }, 500));
  }

  /**
   * Handles units switch
   * @private
   */
  handleUnitSwitch() {
    SettingsService.switchUnits();
    this._getWeather(this.state.searchTerm);
  }
}

export default App;
