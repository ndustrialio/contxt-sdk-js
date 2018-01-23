import axios from 'axios';

class Request {
  constructor(sdk) {
    this.sdk = sdk;
    this.axios = axios.create();

    this.axios.interceptors.request.use(this.insertHeaders);
  }

  delete(...args) {
    return this.axios.delete(...args);
  }

  get(...args) {
    return this.axios.get(...args);
  }

  head(...args) {
    return this.axios.head(...args);
  }

  insertHeaders = (config) => {
    config.headers.common.Authorization = `Bearer: ${this.sdk.auth.getCurrentToken()}`;

    return config;
  }

  options(...args) {
    return this.axios.options(...args);
  }

  patch(...args) {
    return this.axios.patch(...args);
  }

  post(...args) {
    return this.axios.post(...args);
  }

  put(...args) {
    return this.axios.put(...args);
  }

  request(...args) {
    return this.axios.request(...args);
  }
}

export default Request;
