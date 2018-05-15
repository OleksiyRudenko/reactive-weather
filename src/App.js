import React, { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCurrent from './components/WeatherCurrent';
import WeatherForecast from './components/WeatherForecast';
import {SettingsService} from "./services/SettingsService";
import {WeatherService} from "./services/WeatherService";
import {FavCityService} from "./services/FavCityService";
import * as dom from './utils/dom.js';
import {CityHistoryService} from "./services/CityHistoryService";
import {UrlService} from "./services/UrlService";
import {config} from './config.js';

class App extends Component {
  constructor(props={}) {
    super(props);
    this.state = {
      searchTerm: UrlService.getCityName(),
      weatherCurrent: null,
      weatherForecast: null,
    };
    dom.bindHandlers(this, 'handleLocation', 'handleUnitSwitch', 'handleFavCitySwitch', '_addHistoryEntry');
    if (this.state.searchTerm.length) {
      this.handleLocation(this.state.searchTerm);
    }
    UrlService.addNavigationHandler(this.handleLocation);
  }

  /**
   * Renders component
   * @returns {string}
   */
  render() {
    return (
      <div className="App" ref={element => this.UIelement = element}>
        <SearchBar locationHandler={this.handleLocation} searchTerm={this.state.searchTerm} />
        {this.state.weatherCurrent && <WeatherCurrent data={this.state.weatherCurrent} unitSwitchHandler={this.handleUnitSwitch} favCitySwitch={this.handleFavCitySwitch} />}
        {this.state.weatherForecast && <WeatherForecast data={this.state.weatherForecast} />}
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
      this._getWeatherForecast(inputType, query);
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
      this.renderMood(data.date, data.geolat, data.verbose);
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
        }).catch(console.error);
      }
    }, 500)).catch(error => {
      this.setState({weatherCurrent: {
          errorMessage: error,
        }});
    });
  }

  /**
   * Show weather forecast
   * @param {string} inputType {cityname|latlon}
   * @param {Object} query
   * @private
   */
  _getWeatherForecast(inputType, query) {
    this.setState({weatherForecast: 'pending'});
    WeatherService.getWeatherForecast(inputType, query).then(data => setTimeout(() => {
      console.log('APP._getWeatherForecast data', data);
      this.setState({weatherForecast: data});
    }, 700)).catch(error => {
      this.setState({weatherForecast: {
          errorMessage: error,
      }});
    });
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
    UrlService.updateUrl(cityFull);
  }

  componentDidMount() {
    this.renderMood();
  }

  /* === Mood === */

  /**
   *
   * @param {Date} date
   * @param {number} geolat
   * @param {Object} verboseConditions { tod: day|night, conditions: clearSky|rain|... }
   */
  renderMood(date, geolat, verboseConditions) {
    if (!date) date = new Date();
    if (!geolat) geolat = 50;
    if (!verboseConditions) verboseConditions = {tod: 0, conditions: 0};
    const season = this._getSeason(date, geolat);
    const img = this._getMoodImage(verboseConditions.conditions, verboseConditions.tod, season);
    this.UIelement.style.backgroundImage = "url('" + img + "')";
  }

  /**
   * Gets season hemisphere- and longitude-wise
   * @param {Date} date
   * @param {number} geolat
   * @returns {string} spring|summer|autumn|winter
   */
  _getSeason(date, geolat) {
    const month = date.getMonth() + 1;
    let season = month < 4 ? 'winter'
      : month < 6 ? 'spring'
        : month < 9 ? 'summer'
          : month < 12 ? 'autumn'
            : 'winter';
    // invert season for Southern hemisphere
    if (geolat < 0) {
      season = season === 'winter' ? 'summer' : season === 'summer' ? 'winter' : season;
    }
    if (geolat > 65 || geolat < -60) season = 'winter';
    if (geolat <=30 && geolat >-30) season = 'summer';
    return season;
  }

  /**
   *
   * @param {string} conditions clearSky|rain|snow|...
   * @param {string} tod time of day == day|night
   * @param {string} season
   * @returns {string} mood image url
   */
  _getMoodImage(conditions, tod, season) {
    if (!conditions) return config.mood.seasons[season];
    if (conditions === 'unknown') conditions = 'clearSky';
    return config.mood.imagery[conditions][tod][season];
  }
}

export default App;
