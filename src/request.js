import axios from 'axios';

class Request {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {string} audienceName The audience name for this instance. Used when grabbing a
   *   Bearer token
   */
  constructor(sdk, audienceName) {
    this._audienceName = audienceName;
    this._axios = axios.create();
    this._insertHeaders = this._insertHeaders.bind(this);
    this._sdk = sdk;

    this._attachInterceptors();
  }

  /**
   * Makes a DELETE request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  delete(...args) {
    return this._axios.delete(...args).then(({ data }) => data);
  }

  /**
   * Makes a GET request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  get(...args) {
    return this._axios.get(...args).then(({ data }) => data);
  }

  /**
   * Makes a HEAD request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  head(...args) {
    return this._axios.head(...args).then(({ data }) => data);
  }

  /**
   * Makes an OPTIONS request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  options(...args) {
    return this._axios.options(...args).then(({ data }) => data);
  }

  /**
   * Makes a PATCH request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  patch(...args) {
    return this._axios.patch(...args).then(({ data }) => data);
  }

  /**
   * Makes a POST request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  post(...args) {
    return this._axios.post(...args).then(({ data }) => data);
  }

  /**
   * Makes a PUT request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  put(...args) {
    return this._axios.put(...args).then(({ data }) => data);
  }

  /**
   * Makes a request
   * See more at {@link https://github.com/axios/axios axios}
   *
   * @returns {Promise}
   * @fulfill {string|number|object|array} data
   */
  request(...args) {
    return this._axios.request(...args).then(({ data }) => data);
  }

  /**
   * Sets up axios interceptors for the request instance
   * More information at {@link https://github.com/axios/axios#interceptors axios Interceptors}
   *
   * @private
   */
  _attachInterceptors() {
    const requestInterceptors = [
      { fulfilled: this._insertHeaders },
      ...this._sdk.config.interceptors.request
    ];
    const responseInterceptors = [...this._sdk.config.interceptors.response];

    requestInterceptors.forEach(({ fulfilled, rejected }) => {
      this._axios.interceptors.request.use(fulfilled, rejected);
    });
    responseInterceptors.forEach(({ fulfilled, rejected }) => {
      this._axios.interceptors.response.use(fulfilled, rejected);
    });
  }

  /**
   * Decorates custom modules onto the SDK instance so they behave as first-class citizens.
   *
   * @param {Object} config
   * @param {Object} config.headers
   * @param {Object} config.headers.common
   *
   * @returns {Promise}
   * @fulfill {Object} axios.js config
   *
   * @private
   */
  _insertHeaders(config) {
    return this._sdk.auth
      .getCurrentApiToken(this._audienceName)
      .then((apiToken) => {
        config.headers.common.Authorization = `Bearer ${apiToken}`;

        return config;
      });
  }
}

export default Request;
