import React, { Component } from 'react';
import './WeatherForecast.css';

export default class WeatherForecast extends Component {
  render() {
    const data = this.props.data;
    console.log('WeatherForecast.render() data', data);
    if (data === 'pending') {
      return (<div className="width-100"><div className='loader loader-big'>
        <i className="wi wi-day-sunny"></i>
      </div></div>);
    }

    return (<div className="weather-forecast">
      {data.weatherSchedule.map((item,idx) => <WeatherForecastItem key={idx.toString()} data={item} />)}
    </div>);
  }
}

function WeatherForecastItem(props) {
  return (<div class={"wf-item " + getShadeOfTheTime(props.data.dtHours)}>
    <div class="wf-icon"><i class={"wi " + props.data.descrIconClass}></i></div>
    <div class="wf-descr">{props.data.descr}</div>
    <div class="wf-temp">{props.data.temp}°</div>
    <div class="wf-time">{props.data.dtHours}:00</div>
    <div class="wf-date">{props.data.dtDate}</div>
    </div>);
}

/**
 * Returns shade of time of the day based on hours
 * @param hours
 * @returns {string}
 */
function getShadeOfTheTime(hours) {
  return (hours < '01') ? 'wf-dark' :
    (hours < '04') ? 'wf-darkest' :
      (hours < '07') ? 'wf-dark' :
        (hours < '10') ? 'wf-neutral' :
          (hours < '13') ? 'wf-light' :
            (hours < '16') ? 'wf-lightest' :
              (hours < '19') ? 'wf-light' :
                (hours < '22') ? 'wf-neutral' :
                  'wf-dark';
}
