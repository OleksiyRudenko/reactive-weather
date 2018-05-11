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
    query.units = SettingsService.units;

    console.log('App.getWeather', query);

    WeatherService.apiRequest('current', inputType, query)
      .then(result => console.log('App.getWeather.current = ', this._extractCurrentWeather(result)));
    WeatherService.apiRequest('forecast5', inputType, query)
      .then(result => console.log('App.getWeather.forecast5 = ', this._extractForecast(result)));
  }

  /**
   * Converts current weather data adapted for display
   * @param {Object} src
   * @private
   */
  _extractCurrentWeather(src) {
    return {
      dt: src.dt,
      geocity: src.name,
      geocountry: src.sys.country,
      geolat: src.coord.lat,
      geolon: src.coord.lon,
      descr: src.weather[0].main,
      descrDetails: src.weather[0].description,
      descrIcon: '<img src="' + WeatherService.apiIconUrl(src.weather[0].icon) + '" />',
      verbose: src.weather[0].verbose,
      temp: Math.round(src.main.temp),
      pressure: Math.round(src.main.pressure),
      humidity: src.main.humidity,
      windSpeed: Math.round(src.wind.speed),
      windAzimuth: this.degree2arrow('deg' in src.wind ? Math.round(src.wind.deg) : null),
      clouds: src.clouds.all,
    };
  }

  /**
   * Converts forecast weather data adapted for display
   * @param {Object} src
   * @private
   */
  _extractForecast(src) {
    let result = {
      // dt: src.dt,
      geocity: src.city.name,
      geocountry: src.city.country,
      geolat: src.city.coord.lat,
      geolon: src.city.coord.lon,
    };

    let weatherList = src.list.filter(item => {
      const time = item.dt_txt.substring(11,13);
      // console.log('Time: ' + time);
      return (time === '03' || time === '09' || time === '15' || time === '21');

    });
    weatherList.sort((a,b) => a.dt - b.dt);
    result.weatherSchedule = weatherList.map(item => ({
      dtDate: item.dt_txt.substring(8,10) + '/' + item.dt_txt.substring(5,7),
      dtHours: item.dt_txt.substring(11,13),
      descr: item.weather[0].main,
      descrDetails: item.weather[0].description,
      descrIcon: '<img src="' + WeatherService.apiIconUrl(item.weather[0].icon) + '" />',
      verbose: item.weather[0].verbose,
      temp: Math.round(item.main.temp),
      pressure: Math.round(item.main.pressure),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed),
      windAzimuth: this.degree2arrow('deg' in item.wind ? Math.round(item.wind.deg) : null),
      clouds: item.clouds.all,
    }));

    return result;
  }

  /**
   * Converts degree [0, 360] to the relevant HTML entity
   * @param degree
   */
  degree2arrow(degree) {
    if (degree === null) return '';
    degree = degree % 360;
    const presets = {
      0: 'uarr',
      22: 'nearr',
      67: 'rarr',
      112: 'searr',
      157: 'darr',
      202: 'swarr',
      247: 'larr',
      292: 'nwarr',
      337: 'uarr',
    };
    // console.log('Degree: ' + degree);
    return '&'
      + Object.keys(presets).reduce((acc, degKey) => {
        return (degree >= degKey) ? presets[degKey] : acc;
      }, '')
      + ';';
  }
}

export default App;
