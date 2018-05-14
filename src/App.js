import React, { Component } from 'react';
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
    dom.bindHandlers(this, 'handleLocation', 'handleUnitSwitch', 'handleFavCitySwitch');
  }

  /**
   * Renders component
   * @returns {string}
   */
  render() {
    return (
      <div className="App">
        <SearchBar locationHandler={this.handleLocation} />
        {this.state.weatherCurrent && <WeatherCurrent data={this.state.weatherCurrent} unitSwitchHandler={this.handleUnitSwitch} favCitySwitch={this.handleFavCitySwitch} />}
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
    const inputType = this._detectInputType(location);
    const query = this._buildQuery(location);
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
        data.isFavCity = !!result;
        this.setState({weatherCurrent: data});
      }).catch(e => console.error);
    }, 500));
  }

  /**
   * Handles units switch
   */
  handleUnitSwitch() {
    SettingsService.switchUnits();
    this._getWeather(this.state.searchTerm);
  }

  /**
   * Handles favourite city switch
   */
  handleFavCitySwitch(isFavCity, cityNameFull) {
    console.log('App.handleFavCitySwitch: change state ', isFavCity, 'for', cityNameFull);
    const method = isFavCity ? 'deleteEntry' : 'addEntry';
    const argument = isFavCity ? cityNameFull : {name:cityNameFull};
    FavCityService[method](argument).then(() => {
      console.log('App.handleFavCitySwitch: changed state with method', method);
      this._getCurrentWeather(this.state.weatherCurrent.originalEndPoint, this.state.weatherCurrent.originalQuery);
    });
  }

  /**
   * Detects input type (latlon|cityname) from location input
   * @param location
   * @returns {string}
   * @private
   */
  _detectInputType(location) {
    return /^[-\d\s,.]+$/.test(location) ? 'latlon' : 'cityname';
  }

  /**
   * Builds query from location input
   * @param {string} location
   * @returns {Object}
   * @private
   */
  _buildQuery(location) {
    let query = {};

    switch (this._detectInputType(location)) {
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
    return query;
  }
}

export default App;
