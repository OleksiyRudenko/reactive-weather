import {config} from './config.js';
import {StorageService} from '../StorageService';

class _CityHistoryService {
  constructor() {
    this.config = config;
    this._initializeStore();
  }

  /**
   * Add search item to the storage
   * @param {Object} item {name:cityname}
   */
  addEntry(item) {
    // update item content
    item.lastQueried = + new Date();
    item.nameUC = item.name.toUpperCase();
    // store item
    StorageService.put(this.config.storeName,item); /*.then(() => {
      console.log('Search item added. {' + item.name + ', ' + item.lastQueried + '}');
    }); */
  }

  /**
   * Get {limit} last history items
   * @param {number} limit=20 - Search limit
   * @returns {Promise} Ordered list of citynames
   */
  getItems(limit=20) {
    return StorageService.getAll(this.config.storeName).then(items => {
      items.sort((a,b) => b.lastQueried - a.lastQueried);
      items = items.slice(0,limit).map(item => item.name);
      items.sort();
      return items;
    });
  }

  /* === Private methods === */
  /**
   * Initialize store with default dataset if empty
   */
  _initializeStore() {
    StorageService.storeCount(this.config.storeName).then(count => {
      if (!count) {
        StorageService.put(this.config.storeName, this.config.historyInitialSet); /*.then(()=>{
          console.log('History initialized.');
        }); */
      }
      // console.log('CityListService.updateStorage(cities).count==' + count);
    });
  }

}

export const CityHistoryService = new _CityHistoryService();
