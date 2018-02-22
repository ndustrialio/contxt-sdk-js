import axios from 'axios';

class Request {
  constructor(sdk, audienceName) {
    this._audienceName = audienceName;
    this._sdk = sdk;
    this._axios = axios.create();

    this._axios.interceptors.request.use(this._insertHeaders);
  }

  delete(...args) {
    return this._axios.delete(...args)
      .then(({ data }) => data);
  }

  get(...args) {
    return this._axios.get(...args)
      .then(({ data }) => data);
  }

  head(...args) {
    return this._axios.head(...args)
      .then(({ data }) => data);
  }

  options(...args) {
    return this._axios.options(...args)
      .then(({ data }) => data);
  }

  patch(...args) {
    return this._axios.patch(...args)
      .then(({ data }) => data);
  }

  post(...args) {
    return this._axios.post(...args)
      .then(({ data }) => data);
  }

  put(...args) {
    return this._axios.put(...args)
      .then(({ data }) => data);
  }

  request(...args) {
    return this._axios.request(...args)
      .then(({ data }) => data);
  }

  _insertHeaders = (config) => {
    config.headers.common.Authorization = `Bearer ${this._sdk.auth.getCurrentApiToken(this._audienceName)}`;

    return config;
  }
}

export default Request;
