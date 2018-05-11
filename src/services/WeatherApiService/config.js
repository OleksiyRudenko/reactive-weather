export const config = {
  apiUrl : 'https://api.openweathermap.org/data/2.5/',
  apiEndpoint : {
    current: {
      cityname : { path: 'weather', params: ['q'] }, // ?q={city name},{country code}
      latlon : { path: 'weather', params: ['lat', 'lon'] }, //?lat={lat}&lon={lon}
    },
    forecast5 : {
      cityname : { path: 'forecast', params: ['q'] }, // ?q={city name},{country code}
      latlon : { path: 'weather', params: ['lat', 'lon'] }, //?lat={lat}&lon={lon}
    },
  },
  apiKey: '0f034f0e9216aaa8ed94c3d87af01e18',
  apiParamName: 'APPID',
  iconUrl: 'https://openweathermap.org/img/w/',
  iconExt: '.png',
};
