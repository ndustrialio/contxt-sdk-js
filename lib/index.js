'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var auth0 = _interopDefault(require('auth0-js'));

var defaultAudiences = {
  contxtAuth: {
    production: {
      clientId: '75wT048QcpE7ujwBJPPjr263eTHl4gEX',
      host: 'https://contxtauth.com'
    },
    staging: {
      clientId: 'XzgumXUg5U57015haylz4zaJsiQqZy4l',
      host: 'https://contxt-auth-staging.api.ndustrial.io'
    }
  },
  facilities: {
    production: {
      clientId: 'SgbCopArnGMa9PsRlCVUCVRwxocntlg0',
      host: 'https://facilities.api.ndustrial.io'
    },
    staging: {
      clientId: 'xG775XHIOZVUn84seNeHXi0Qe55YuR5w',
      host: 'https://facilities-staging.api.ndustrial.io'
    }
  }
};

var defaultConfigs = {
  auth: {
    authorizationPath: '/callback'
  }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var Config = function () {
  function Config(userConfig, externalModules) {
    classCallCheck(this, Config);

    Object.assign(this, userConfig);

    this.audiences = this._getAudiences({
      externalModules: externalModules,
      customModuleConfigs: userConfig.customModuleConfigs,
      env: userConfig.env
    });

    this.auth = _extends({}, defaultConfigs.auth, userConfig.auth);
  }

  createClass(Config, [{
    key: '_getAudienceFromCustomConfig',
    value: function _getAudienceFromCustomConfig(config, audiences) {
      if (config.clientId && config.host) {
        return {
          clientId: config.clientId,
          host: config.host
        };
      } else if (config.env) {
        return audiences[config.env];
      } else {
        throw new Error('Custom module configurations must either contain a `host` and `clientId` or specify a specific target environment via the `env` property');
      }
    }
  }, {
    key: '_getAudiences',
    value: function _getAudiences() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$customModule = options.customModuleConfigs,
          customModuleConfigs = _options$customModule === undefined ? {} : _options$customModule,
          _options$env = options.env,
          env = _options$env === undefined ? 'production' : _options$env,
          _options$externalModu = options.externalModules,
          externalModules = _options$externalModu === undefined ? {} : _options$externalModu;


      return _extends({}, this._getInternalAudiences({
        customModuleConfigs: customModuleConfigs,
        env: env,
        audiences: defaultAudiences
      }), this._getExternalAudiences({ externalModules: externalModules }));
    }
  }, {
    key: '_getExternalAudiences',
    value: function _getExternalAudiences(_ref) {
      var externalModules = _ref.externalModules;

      return Object.keys(externalModules).reduce(function (memo, key) {
        if (!(externalModules[key].clientId && externalModules[key].host)) {
          throw new Error('External modules must contain `clientId` and `host` properties');
        }

        memo[key] = {
          clientId: externalModules[key].clientId,
          host: externalModules[key].host
        };

        return memo;
      }, {});
    }
  }, {
    key: '_getInternalAudiences',
    value: function _getInternalAudiences(_ref2) {
      var _this = this;

      var audiences = _ref2.audiences,
          customModuleConfigs = _ref2.customModuleConfigs,
          env = _ref2.env;

      return Object.keys(audiences).reduce(function (memo, key) {
        var customModuleConfig = customModuleConfigs[key];
        var moduleAudiences = audiences[key];

        if (customModuleConfig) {
          memo[key] = _this._getAudienceFromCustomConfig(customModuleConfig, moduleAudiences);
        } else {
          memo[key] = moduleAudiences[env];
        }

        return memo;
      }, {});
    }
  }]);
  return Config;
}();

var Facilities = function () {
  function Facilities(sdk, request) {
    classCallCheck(this, Facilities);

    this._baseUrl = sdk.config.audiences.facilities.host + "/v1";
    this._request = request;
    this._sdk = sdk;
  }

  createClass(Facilities, [{
    key: "get",
    value: function get$$1(facilityId) {
      return this._request.get(this._baseUrl + "/facilities/" + facilityId);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this._request.get(this._baseUrl + "/facilities");
    }
  }]);
  return Facilities;
}();

var Request = function () {
  function Request(sdk, audienceName) {
    var _this = this;

    classCallCheck(this, Request);

    this._insertHeaders = function (config) {
      config.headers.common.Authorization = 'Bearer ' + _this._sdk.auth.getCurrentApiToken(_this._audienceName);

      return config;
    };

    this._audienceName = audienceName;
    this._sdk = sdk;
    this._axios = axios.create();

    this._axios.interceptors.request.use(this._insertHeaders);
  }

  createClass(Request, [{
    key: 'delete',
    value: function _delete() {
      var _axios;

      return (_axios = this._axios).delete.apply(_axios, arguments).then(function (_ref) {
        var data = _ref.data;
        return data;
      });
    }
  }, {
    key: 'get',
    value: function get$$1() {
      var _axios2;

      return (_axios2 = this._axios).get.apply(_axios2, arguments).then(function (_ref2) {
        var data = _ref2.data;
        return data;
      });
    }
  }, {
    key: 'head',
    value: function head() {
      var _axios3;

      return (_axios3 = this._axios).head.apply(_axios3, arguments).then(function (_ref3) {
        var data = _ref3.data;
        return data;
      });
    }
  }, {
    key: 'options',
    value: function options() {
      var _axios4;

      return (_axios4 = this._axios).options.apply(_axios4, arguments).then(function (_ref4) {
        var data = _ref4.data;
        return data;
      });
    }
  }, {
    key: 'patch',
    value: function patch() {
      var _axios5;

      return (_axios5 = this._axios).patch.apply(_axios5, arguments).then(function (_ref5) {
        var data = _ref5.data;
        return data;
      });
    }
  }, {
    key: 'post',
    value: function post() {
      var _axios6;

      return (_axios6 = this._axios).post.apply(_axios6, arguments).then(function (_ref6) {
        var data = _ref6.data;
        return data;
      });
    }
  }, {
    key: 'put',
    value: function put() {
      var _axios7;

      return (_axios7 = this._axios).put.apply(_axios7, arguments).then(function (_ref7) {
        var data = _ref7.data;
        return data;
      });
    }
  }, {
    key: 'request',
    value: function request() {
      var _axios8;

      return (_axios8 = this._axios).request.apply(_axios8, arguments).then(function (_ref8) {
        var data = _ref8.data;
        return data;
      });
    }
  }]);
  return Request;
}();

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
var requiresPort = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
var stringify = querystringify;
var parse = querystring;

var querystringify_1 = {
	stringify: stringify,
	parse: parse
};

var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || commonjsGlobal.location || {};

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = querystringify_1.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!requiresPort(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set$1(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || querystringify_1.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!requiresPort(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = querystringify_1.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set$1, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = querystringify_1;

var urlParse = URL;

var Auth0WebAuth = function () {
  function Auth0WebAuth(sdk) {
    classCallCheck(this, Auth0WebAuth);

    this._sdk = sdk;

    if (!this._sdk.config.auth.clientId) {
      throw new Error('clientId is required for the WebAuth config');
    }

    this._onRedirect = this._sdk.config.auth.onRedirect || this._defaultOnRedirect;
    this._sessionInfo = this._loadSession();

    var currentUrl = new urlParse(window.location);
    currentUrl.set('pathname', this._sdk.config.auth.authorizationPath);

    this._auth0 = new auth0.WebAuth({
      audience: this._sdk.config.audiences.contxtAuth.clientId,
      clientID: this._sdk.config.auth.clientId,
      domain: 'ndustrial.auth0.com',
      redirectUri: '' + currentUrl.origin + currentUrl.pathname,
      responseType: 'token',
      scope: 'profile openid'
    });
  }

  createClass(Auth0WebAuth, [{
    key: 'getCurrentAccessToken',
    value: function getCurrentAccessToken() {
      return this._getCurrentTokenByType('access');
    }
  }, {
    key: 'getCurrentApiToken',
    value: function getCurrentApiToken() {
      return this._getCurrentTokenByType('api');
    }
  }, {
    key: 'getProfile',
    value: function getProfile() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._auth0.client.userInfo(_this.getCurrentAccessToken(), function (err, profile) {
          if (err) {
            reject(err);
          }

          resolve(profile);
        });
      });
    }
  }, {
    key: 'handleAuthentication',
    value: function handleAuthentication() {
      var _this2 = this;

      return this._parseWebAuthHash().then(function (hash) {
        return Promise.all([{
          accessToken: hash.accessToken,
          expiresAt: hash.expiresIn * 1000 + Date.now()
        }, _this2._getApiToken(hash.accessToken)]);
      }).then(function (_ref) {
        var _ref2 = slicedToArray(_ref, 2),
            partialSessionInfo = _ref2[0],
            apiToken = _ref2[1];

        var sessionInfo = _extends({}, partialSessionInfo, {
          apiToken: apiToken
        });

        _this2._saveSession(sessionInfo);

        return sessionInfo;
      }).then(function (sessionInfo) {
        var redirectPathname = _this2._getRedirectPathname();

        _this2._onRedirect(redirectPathname);

        return sessionInfo;
      }).catch(function (err) {
        console.log('Error while handling authentication: ' + err);

        _this2._onRedirect('/');

        throw err;
      });
    }
  }, {
    key: 'isAuthenticated',
    value: function isAuthenticated() {
      var hasTokens = !!(this._sessionInfo && this._sessionInfo.accessToken && this._sessionInfo.apiToken && this._sessionInfo.expiresAt);

      return hasTokens && this._sessionInfo.expiresAt > Date.now();
    }
  }, {
    key: 'logIn',
    value: function logIn() {
      this._auth0.authorize();
    }
  }, {
    key: 'logOut',
    value: function logOut() {
      this._sessionInfo = {};

      localStorage.removeItem('access_token');
      localStorage.removeItem('api_token');
      localStorage.removeItem('expires_at');

      this._onRedirect('/');
    }
  }, {
    key: '_defaultOnRedirect',
    value: function _defaultOnRedirect(pathname) {
      window.location = pathname;
    }
  }, {
    key: '_getApiToken',
    value: function _getApiToken(accessToken) {
      var _this3 = this;

      return axios.post(this._sdk.config.audiences.contxtAuth.host + '/v1/token', {
        audiences: Object.keys(this._sdk.config.audiences).map(function (audienceName) {
          return _this3._sdk.config.audiences[audienceName].clientId;
        }).filter(function (clientId) {
          return clientId !== _this3._sdk.config.audiences.contxtAuth.clientId;
        }),
        nonce: 'nonce'
      }, {
        headers: { Authorization: 'Bearer ' + accessToken }
      }).then(function (_ref3) {
        var data = _ref3.data;
        return data.access_token;
      });
    }
  }, {
    key: '_getCurrentTokenByType',
    value: function _getCurrentTokenByType(type) {
      var propertyName = type + 'Token';

      if (!(this._sessionInfo && this._sessionInfo[propertyName])) {
        throw new Error('No ' + type + ' token found');
      }

      return this._sessionInfo[propertyName];
    }
  }, {
    key: '_getRedirectPathname',
    value: function _getRedirectPathname() {
      var redirectPathname = localStorage.getItem('redirect_pathname');
      localStorage.removeItem('redirect_pathname');

      return redirectPathname || '/';
    }
  }, {
    key: '_loadSession',
    value: function _loadSession() {
      return {
        accessToken: localStorage.getItem('access_token'),
        apiToken: localStorage.getItem('api_token'),
        expiresAt: localStorage.getItem('expires_at')
      };
    }
  }, {
    key: '_parseWebAuthHash',
    value: function _parseWebAuthHash() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._auth0.parseHash(function (err, hashResponse) {
          if (err || !hashResponse) {
            return reject(err || new Error('No valid tokens returned from auth0'));
          }

          return resolve(hashResponse);
        });
      });
    }
  }, {
    key: '_saveSession',
    value: function _saveSession(sessionInfo) {
      this._sessionInfo = sessionInfo;

      localStorage.setItem('access_token', sessionInfo.accessToken);
      localStorage.setItem('api_token', sessionInfo.apiToken);
      localStorage.setItem('expires_at', sessionInfo.expiresAt);
    }
  }]);
  return Auth0WebAuth;
}();

var ContxtSdk = function () {
  function ContxtSdk(_ref) {
    var _ref$config = _ref.config,
        config = _ref$config === undefined ? {} : _ref$config,
        _ref$externalModules = _ref.externalModules,
        externalModules = _ref$externalModules === undefined ? {} : _ref$externalModules,
        sessionType = _ref.sessionType;
    classCallCheck(this, ContxtSdk);

    this.config = new Config(config, externalModules);

    this.auth = this._createAuthSession(sessionType);
    this.facilities = new Facilities(this, this._createRequest('facilities'));

    this._decorate(externalModules);
  }

  createClass(ContxtSdk, [{
    key: '_createAuthSession',
    value: function _createAuthSession(sessionType) {
      switch (sessionType) {
        case 'auth0WebAuth':
          return new Auth0WebAuth(this);

        default:
          throw new Error('Invalid sessionType provided');
      }
    }
  }, {
    key: '_createRequest',
    value: function _createRequest(audienceName) {
      return new Request(this, audienceName);
    }
  }, {
    key: '_decorate',
    value: function _decorate(modules) {
      var _this = this;

      Object.keys(modules).forEach(function (moduleName) {
        _this[moduleName] = new modules[moduleName].module(_this, _this._createRequest(moduleName));
      });
    }
  }]);
  return ContxtSdk;
}();

module.exports = ContxtSdk;
//# sourceMappingURL=index.js.map
