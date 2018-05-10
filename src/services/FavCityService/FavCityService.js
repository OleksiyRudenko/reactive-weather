import {config} from './config.js';
import StorageService from '../StorageService';

class _FavCityService {
  constructor() {
    this.config = config;
  }

  /**
   * Add favourite city item to the store
   * @param {Object} item {name:cityname}
   */
  addEntry(item) {
    // update item content
    item.nameUC = item.name.toUpperCase();
    // store item
    return StorageService.put(this.config.storeName,item);
  }

  /**
   * Remove favourite city item from the storage
   * @param {string} cityNameFull
   */
  deleteEntry(cityNameFull) {
    return StorageService.delete(this.config.storeName, cityNameFull);
  }

  /**
   * Get {limit} favourite cities items
   * @param {number} limit=20 - Search limit
   * @returns {Promise} Ordered list of citynames
   */
  getItems(limit=20) {
    return StorageService.getAll(this.config.storeName).then(items => {
      items.sort((a,b) => b.nameUC > a.nameUC);
      items = items.slice(0,limit).map(item => item.name);
      items.sort();
      return items;
    });
  }

  /**
   * Get (find) favourite cities items
   * @param {string} keyValue - Search value
   * @returns {Promise} result if found
   */
  getItem(keyValue) {
    return StorageService.get(this.config.storeName,'',keyValue);
  }
}

export const FavCityService = new _FavCityService();
