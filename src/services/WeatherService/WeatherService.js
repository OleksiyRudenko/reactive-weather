import {WeatherApiService} from "../WeatherApiService";

class _WeatherService {

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
    return {
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

export const WeatherService = new _WeatherService();
