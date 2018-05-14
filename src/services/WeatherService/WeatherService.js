import {WeatherApiService} from "../WeatherApiService";
import {SettingsService} from "../SettingsService";
import {config} from "./config.js";

class _WeatherService {
  constructor() {
    this.config = config;
  }

  /**
   * Get current weather for a given location {cityname|latlon}
   * @param inputType
   * @param query
   * @returns {Promise<{dt, geocity, geocountry, geolat, geolon, descr, descrDetails, descrIcon, verbose, temp, pressure, humidity, windSpeed, windAzimuth, clouds}>}
   */
  getCurrentWeather(inputType, query) {
    return WeatherApiService.apiRequest('current', inputType, query)
      .then(result => this._extractCurrentWeather(result));
  }

  /**
   * Get weather forecast for a given location {cityname|latlon}
   * @param inputType
   * @param query
   * @returns {Promise<Response>}
   */
  getWeatherForecast(inputType, query) {
    return WeatherApiService.apiRequest('forecast5', inputType, query)
      .then(result => this._extractForecast(result));
  }

  /**
   * Converts current weather data adapted for display
   * @param {Object} src
   * @private
   */
  _extractCurrentWeather(src) {
    let result = {
      dt: src.dt,
      geocity: src.name,
      geocountry: src.sys.country,
      geolat: src.coord.lat,
      geolon: src.coord.lon,
      descr: src.weather[0].main,
      descrDetails: src.weather[0].description,
      descrIcon: '<img src="' + WeatherApiService.apiIconUrl(src.weather[0].icon) + '" />',
      verbose: src.weather[0].verbose,
      temp: Math.round(src.main.temp),
      pressure: Math.round(src.main.pressure),
      humidity: src.main.humidity,
      windSpeed: Math.round(src.wind.speed),
      windAzimuth: this.degree2arrow('deg' in src.wind ? Math.round(src.wind.deg) : null),
      clouds: src.clouds.all,
      originalQuery: src.originalQuery,
      originalEndPoint: src.originalEndPoint,
    };
    // enrich data
    const lon = Math.round(result.geolon * 10) / 10 * (result.geolon<0?-1:1) + (result.geolon<0?'W':'E');
    const lat = Math.round(result.geolat * 10) / 10 * (result.geolat<0?-1:1) + (result.geolat<0?'S':'N');

    result = Object.assign(result, {
      descrIconClass : 'wi ' + this._getWeatherConditionsIcon(result.verbose.tod, result.verbose.conditions),
      windSpeedUnits : SettingsService.windSpeedUnits,
      date : new Date(result.dt * 1000),
      cityFull : result.geocity + (result.geocountry ? ',' + result.geocountry : ''),
      geoFull : lat + ',' + lon,
      pressure : Math.round(result.pressure / 1013.25 * 100) / 100,
    });
    return result;
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
      originalQuery: src.originalQuery,
      originalEndPoint: src.originalEndPoint,
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
      descrIcon: '<img src="' + WeatherApiService.apiIconUrl(item.weather[0].icon) + '" />',
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
      0: '↑', // 'uarr',
      22: '↗', // 'nearr',
      67: '→', // 'rarr',
      112: '↘', // 'searr',
      157: '↓', // ''darr',
      202: '↙', // 'swarr',
      247: '←', // 'larr',
      292: '↖', // 'nwarr',
      337: '↑', // 'uarr',
    };
    // console.log('Degree: ' + degree);
    return /* '&' + */ Object.keys(presets).reduce((acc, degKey) => {
        return (degree >= degKey) ? presets[degKey] : acc;
      }, '');
      // + ';';
  }

  /**
   * Picks weather icon based on time of the day and conditions
   * @param {string} tod = day|night
   * @param {string} verboseConditions = clearSky|rain|snow|...
   * @returns {string}
   */
  _getWeatherConditionsIcon(tod, verboseConditions) {
    if (!tod)
      tod = 'day';
    if (verboseConditions === 'unknown' || Math.floor(Math.random() * 41) > 39) {
      verboseConditions = 'alien';
    }
    return this.config.icons[tod][verboseConditions];
  }
}

export const WeatherService = new _WeatherService();
