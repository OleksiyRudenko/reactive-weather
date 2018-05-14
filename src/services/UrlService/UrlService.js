import {config} from './config.js';

class _UrlService {
  constructor() {
    this.config = config;
    this.navigationHandler = null;
    window.addEventListener('popstate', this.onHistoryNavigation.bind(this), true);
  }

  /**
   * Register a callback
   * @param callback
   */
  addNavigationHandler(callback) {
    this.navigationHandler = callback;
  }

  /**
   * Updates URL
   * @param {string} cityName
   */
  updateUrl(cityName) {
    const targetUrl = this.config.baseUrl + '?q=' + cityName;
    console.log(window.location + ' -- ' + targetUrl);
    if (window.location !== targetUrl)
      window.history.pushState({}, document.title + ': ' + cityName, targetUrl);
  }

  onHistoryNavigation(e) {
    // if (e.state) {
    const cityName = this.getCityName();
    console.log(e.state);
    if (cityName) {
      this.navigationHandler(cityName);
      /* this.dependencies.CityInputController.setValue(cityName, null, false);
      this.dependencies.CityInputController.actionSearch('no-url-update'); */
    }
    // }
  }

  /**
   * Extract city name from url
   */
  getCityName() {
    const url = new URL(window.location.href);
    const cityName = url.searchParams.get('q');
    console.log('UrlService.getCityName =>' + cityName);
    return cityName;
  }
}

export const UrlService = new _UrlService();
