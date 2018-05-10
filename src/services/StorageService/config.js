export const config = {
  dbName: 'reactive-weather',
  dbVersion: 1,
  store: [
    // [0]: upgrade to v.1
    [
      {
        storeName: 'settings',
        storeOptions: {keyPath: 'option'},
        fields: ['option', 'value'], // option = {Units|...}; Units={metric|imperial}
      },
      {
        storeName: 'favcity',
        storeOptions: {keyPath: 'name'},
        fields: ['name', 'nameUC'], // city name, city name uppercase
        index: [['nameUC']],
      },
      {
        storeName: 'cityhistory',
        storeOptions: {keyPath: 'name'},
        fields: ['name', 'nameUC', 'lastQueried'], // city name, city name uppercase, last queried
        index: [['nameUC']],
      },
    ],
    // [1]: upgrade to v.2
    /* [
      {
        storeName: 'cities',
        storeOptions: {keyPath: 'id'},
        fields: ['id', 'name', 'nameUC'], // city name, city name uppercase
        index: [['nameUC']], // indices; when single literal then index name == index key name
      },
      {
        storeName: 'weather',
      },
    ], */
  ], // store
  /*
  cityList: 'assets/city.list.json', // 'assets/city.list.json', | citylist from import
  */
};
