import React, { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCurrent from './components/WeatherCurrent';
import {SettingsService} from "./services/SettingsService";
import {WeatherService} from "./services/WeatherService";
import {FavCityService} from "./services/FavCityService";
import * as dom from './utils/dom.js';
import {CityHistoryService} from "./services/CityHistoryService";

class App extends Component {
  constructor(props={}) {
    super(props);
    this.state = {
      searchTerm: '',
      weatherCurrent: null,
      weatherForecast: null,
    };
    dom.bindHandlers(this, 'handleLocation', 'handleUnitSwitch', 'handleFavCitySwitch', '_addHistoryEntry');
  }

  /**
   * Renders component
   * @returns {string}
   */
  render() {
    return (
      <div className="App">
        <SearchBar locationHandler={this.handleLocation} searchTerm={this.state.searchTerm} />
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
    // this.setState({searchTerm:location});
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
      // WeatherService.getWeatherForecast(inputType, query).then(console.log);
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
      // this.setState({searchTerm: data.cityFull});
      console.log('APP._getCurrentWeather data', data);
      if (data.cityFull && data.cityFull.length) {
        // manage history
        this._addHistoryEntry(data.cityFull);
      }
      if (inputType === 'cityname') {
        FavCityService.getItem(data.cityFull).then(result => {
          // console.log('App._getCurrentWeather', result);
          data.isFavCity = !!result;
          this.setState({weatherCurrent: data});
        }).catch(e => console.error);
      }
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
    return /^[-\d\s,.NSWEnswe]+$/.test(location) ? 'latlon' : 'cityname';
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
        query = this._parseGeoCoords(location);
        break;
      // no default
    }
    return query;
  }

  /**
   * Parses geo coordinates from a string input
   * @param {string} location
   * @private
   */
  _parseGeoCoords(location) {
    // add zeroes to make sure any numerics are in place
    const coordList = (location + ' 0 0').split(/[\s,]/);
    let coord = {
      lat: 0,
      lon: 0,
    };
    // anything with either of SNsn is a latitude; Ss should be negative
    // anything with either of EWew is a longitude; Ww should be negative
    const presets = {
      denoters: ['N', 'S', 'E', 'W'],
      mutators: {
        N: {target: 'lat', factor: 1},
        S: {target: 'lat', factor: -1},
        E: {target: 'lon', factor: 1},
        W: {target: 'lon', factor: -1},
      },
    };
    let parsed = 0;
    // console.log('Parse geo in:', coordList, presets);
    coordList.forEach((coordItem, idx) => {
      if (parsed>=2) return; // skip if we have two legal values parsed
      let numeric = Number(coordItem.replace(/[^-\d.]/g,''));
      if (Number.isNaN(numeric)) return;
      const letter = coordItem.toUpperCase().split('').find(el => presets.denoters.includes(el));
      // console.log('Geo coord parsing', numeric, letter);
      if (typeof letter === 'undefined') {
        coord[!!idx ? 'lon' : 'lat' ] = numeric;
      } else {
        coord[presets.mutators[letter].target] = Math.abs(numeric) * presets.mutators[letter].factor;
      }
      parsed++;
    });

    return coord;
  }

  /**
   * Add item to history list and window.history
   * @param {string} cityFull
   * @private
   */
  _addHistoryEntry(cityFull) {
    console.log('App._addHistoryEntry(): put into history', cityFull);
    this.setState({searchTerm:cityFull});
    CityHistoryService.addEntry({name:cityFull});
  }
}

export default App;
