import {config} from './config.js';
import {StorageService} from '../StorageService';

class _SettingsService {
  constructor() {
    this.config = config;
    this.settingsPromise = this._loadSettings();
  }

  get units() {
    const res = this.config.settings.units ? Promise.resolve(this.config.settings.units) : this.settingsPromise.then(settings => settings.units);
    // console.log('SettingsService', this.config.settings.units, res);
    return res;
  }
  get windSpeedUnits() { return this.config.windSpeed[this.config.settings.units]; }

  /**
   * Switches between units
   */
  switchUnits() {
    this.config.settings.units = (this.config.settings.units === 'metric') ? 'imperial' : 'metric';
    this._updateStorage();
  }

  /**
   * Update settings in storage
   * @private
   */
  _updateStorage() {
    const data = {
      option: 'units',
      value: this.config.settings.units,
    };
    StorageService.put(this.config.storeName, data).then(() => {
      console.log('Settings store updated');
    });
  }

  /**
   * Load settings from store
   * @private
   */
  _loadSettings() {
    StorageService.storeCount(this.config.storeName).then(count => {
      if (!count) {
        this.config.settings = Object.assign({}, this.config.defaultSettings);
        this._updateStorage();
      }
    });
    return StorageService.getAll(this.config.storeName).then(items => {
      items.forEach(e => this.config.settings[e.option]=e.value);
      console.log('StorageService.load:', items);
      return new Promise((resolve, reject) => resolve(this.config.settings));
    });
  }

}

export const SettingsService = new _SettingsService();
