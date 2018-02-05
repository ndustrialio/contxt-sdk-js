import axios from 'axios';

class Request {
  constructor(sdk) {
    this._sdk = sdk;
    this._axios = axios.create();

    this._axios.interceptors.request.use(this._insertHeaders);
  }

  delete(...args) {
    return this._axios.delete(...args);
  }

  get(...args) {
    return this._axios.get(...args);
  }

  head(...args) {
    return this._axios.head(...args);
  }

  options(...args) {
    return this._axios.options(...args);
  }

  patch(...args) {
    return this._axios.patch(...args);
  }

  post(...args) {
    return this._axios.post(...args);
  }

  put(...args) {
    return this._axios.put(...args);
  }

  request(...args) {
    return this._axios.request(...args);
  }

  _insertHeaders = (config) => {
    config.headers.common.Authorization = `Bearer ${this._sdk.auth.getCurrentApiToken()}`;

    return config;
  }
}

export default Request;
