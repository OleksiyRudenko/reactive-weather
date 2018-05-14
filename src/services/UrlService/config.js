export const config = {
  baseUrl: window.location.protocol + "//" + window.location.host
    + window.location.pathname.split('/').slice(0,-1).join('/') + '/',
};
