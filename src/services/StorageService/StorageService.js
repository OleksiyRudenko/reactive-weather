import * as idb from 'idb';
import {config} from './config.js';

class _StorageService {
  constructor() {
    this.config = config;
    this._dbPromise = this._dbOpen(this.config.dbVersion);
    this._logSummary();
  }

  /* === Public methods === */

  /**
   * Insert/update store
   * @param {string} storeName
   * @param {array|object} recordSet - is either an object to store or array of objects to store
   */
  put(storeName, recordSet) {
    // put single object into an array
    if (!Array.isArray(recordSet)) {
      recordSet = [recordSet];
    }
    // const recordSetLength = recordSet.length;
    return this._dbPromise.then(db => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      return Promise.all(recordSet.map(item => store.put(item)) // map
      ).catch(e => {
        tx.abort();
        console.log(e);
        throw e;
      });
    });
  }

  /**
   * Delete from store
   * @param {string} storeName
   * @param {string} keyValue - is either an object to store or array of objects to store
   */
  delete(storeName, keyValue) {
    return this._dbPromise.then(db => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      return store.delete(keyValue);
    });
  }

  /**
   * Get all records from store or optionally from store index optionally filtering by index key field value
   * @param {string} storeName
   * @param {string} indexName
   * @param {string|number} keyValue
   * @returns {Promise<T>}
   */
  getAll(storeName, indexName, keyValue) {
    return this._dbPromise.then(db => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      let queryTarget = store;
      if (indexName) {
        queryTarget = store.index(indexName);
      }
      return queryTarget.getAll(keyValue);
    });
  }

  /**
   * Get all records from store or optionally from store index optionally filtering by index key field value
   * @param {string} storeName
   * @param {string} indexName
   * @param {string|number} keyValue
   * @returns {Promise<T>}
   */
  get(storeName, indexName, keyValue) {
    return this._dbPromise.then(db => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      let queryTarget = store;
      if (indexName) {
        queryTarget = store.index(indexName);
      }
      return queryTarget.get(keyValue);
    });
  }

  /**
   * Returns number of objects in a store
   * @param {string} storeName
   * @returns {Promise<T>}
   */
  storeCount(storeName) {
    return this._dbPromise.then(db => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      return store.count();
    }).catch(console.log);
  }

  /* === Private methods : SECONDARY === */

  /**
   * Create IDB Open promise that creates required stores as per dbVersion
   * @param {number} dbVersion - current db version
   * @returns {Promise<Cache>|IDBOpenDBRequest}
   */
  _dbOpen(dbVersion) {
    return idb.open(this.config.dbName, dbVersion, upgradeDb => {
      const storeVersionedList = this.config.store; // store list
      for (let i=0; i <= upgradeDb.oldVersion; i++) {
        storeVersionedList[i].forEach(storeEntry => {
          let store = upgradeDb.createObjectStore(storeEntry.storeName, storeEntry.storeOptions);
          if (!!storeEntry.index) { // any indices? .index = [ indexSpec,... ]; indexSpec = [indexName, indexKeyName_optional]
            storeEntry.index.forEach(index => {
              store.createIndex(index[0], index[index.length-1]);
            });
          }
        });
      }
    });
  }

  /**
   * Logs database summary
   */
  _logSummary() {
    const storeList = [].concat.apply([], this.config.store).map(e => e.storeName);
    storeList.forEach(storeName => {
      this.storeCount(storeName).then(v => {
        console.log('StorageService:', storeName + '.length == ' + v);
      }).catch(console.log);
    });
  }
}

export const StorageService = new _StorageService();
