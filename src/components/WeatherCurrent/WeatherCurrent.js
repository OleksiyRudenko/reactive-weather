import React, { Component } from 'react';
import './WeatherCurrent.css';

export default class WeatherCurrent extends Component {
  render() {
    const data = this.props.data;
    console.log('WeatherCurrent', data);
    return (
      <div className="weather-current">
        <div className="weather-current-row">
          <button id="favourite-no" className="favourite-no btn-frameless btn-round" title="Love me!"><i className="material-icons">star_border</i></button>
          <button id="favourite-yes" className="favourite-yes btn-frameless btn-round display-none" title="Remove from favourites"><i className="material-icons">star</i></button>
          <div className="weather-current-main-city">{data.cityFull}</div>
          <div className="weather-current-main-geo">{data.geoFull}</div>
        </div>
        <div className="weather-current-row">
          <div className="weather-current-column">
            <div className="weather-current-item">
              <div className="weather-current-header"><i className="wi wi-strong-wind wi-fw"></i></div>
              <div className="weather-current-data">{data.windSpeed}</div>
              <div className="weather-current-data">{data.windSpeedUnits}</div>
              <div className="weather-current-windAzimuth">{data.windAzimuth}</div>
            </div>
            <div className="weather-current-item">
              <div className="weather-current-header"><i className="wi wi-humidity wi-fw"></i></div>
              <div className="weather-current-data">{data.humidity}</div>
              <div className="weather-current-data">%</div>
            </div>
            <div className="weather-current-item">
              <div className="weather-current-header"><i className="wi wi-barometer wi-fw"></i></div>
              <div className="weather-current-data">{data.pressure}</div>
              <div className="weather-current-data">atm</div>
            </div>
          </div>
          <div className="weather-current-row-nowrap">
            <div className="weather-current-main-item weather-current-descrIcon"><i className={data.descrIconClass}></i></div>
            <div className="weather-current-column">
              <div className="weather-current-row">
                <div className="weather-current-temp">{data.temp}</div>
                <div id="unit-switch" className="unit-switch" title="Switch me!">
                  <button className="btn-frameless btn-unit-switch" type="button">
                    <i className="wi wi-celsius"></i>
                  </button>
                  <button className="btn-frameless btn-unit-switch" type="button">
                    <i className="wi wi-fahrenheit"></i>
                  </button>
                </div>
              </div>
              <div className="weather-current-descr-main">{data.descr}</div>
              <div className="weather-current-descr-extended">{data.descrDetails}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
