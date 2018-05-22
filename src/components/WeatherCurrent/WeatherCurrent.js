import React, { Component } from 'react';
import './WeatherCurrent.css';
import * as dom from '../../utils/dom.js';

export default class WeatherCurrent extends Component {
  constructor(props) {
    super(props);
    dom.bindHandlers(this, 'favCitySwitch');
  }
  render() {
    const data = this.props.data;
    // console.log('WeatherCurrent', data);
    if (data === 'pending') {
      return <div className="width-100"><div className='loader loader-big'><i className="wi wi-day-sunny"></i></div></div>;
    }

    let {cityFull, geoFull} = data;

    if (typeof data.showFavControl === 'undefined')
      data.showFavControl = true;
    if (!cityFull.length) {
      // no mnemonic location
      cityFull = geoFull;
      geoFull = '';
      data.showFavControl = false;
    }

    const favCityPresets = (data.isFavCity) ? {
      className: 'weather-current-favourite-yes weather-current-favourite-button',
      title: 'Remove from favourites',
      icon: 'star',
    } : {
      className: 'weather-current-favourite-no weather-current-favourite-button',
      title: 'Love me!',
      icon: 'star_border',
    };
    // console.log('WeatherCurrent.render()', data.showFavControl);
    const favCityStatus = data.showFavControl
      ? (data.isFavCity === 'pending'
        ? <div className='loader loader-small'></div>
        : <button onClick={this.favCitySwitch} className={favCityPresets.className} title={favCityPresets.title}><i className="material-icons">{favCityPresets.icon}</i></button>
      ) : '';
    return (
      <div className="weather-current">
        <div className="weather-current-row">
          {favCityStatus}
          <div className="weather-current-main-city" dangerouslySetInnerHTML={{__html: wbrLocationName(cityFull)}}></div>
          <div className="weather-current-main-geo">{geoFull}</div>
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
                  <button className="weather-current-unit-switch" type="button" title="Switch me!" onClick={this.props.unitSwitchHandler}>
                    <i className={'wi ' + (data.originalQuery.units==='imperial'?'wi-fahrenheit':'wi-celsius')}></i>
                  </button>
              </div>
              <div className="weather-current-descr-main">{data.descr}</div>
              <div className="weather-current-descr-extended">{data.descrDetails}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  favCitySwitch(ev) {
    const data = this.props.data;
    if (data.isFavCity !== 'pending') {
      this.props.favCitySwitch(data.isFavCity, data.cityFull);
    }
  }
}

/**
 * Inserts <wbr>
 * @param locationFullName
 * @returns {*}
 */
function wbrLocationName(locationFullName) {
  return wbr(locationFullName.split(',').join(', '), 10);
}

/**
 * Inserts <WBR> tag in str in words longer than num
 * @param {string} str
 * @param {number} maxlen
 * @returns {string | void | *}
 */
function wbr(str, maxlen) {
  return str.replace(RegExp("(\\w{" + maxlen + "})(\\w)", "g"), (all,text,char) => {
    return text + '<wbr>' + char;
  });
}
