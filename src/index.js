import Assets from './assets';
import Bus from './bus';
import Config from './config';
import Coordinator from './coordinator';
import Events from './events';
import Facilities from './facilities';
import Files from './files';
import Iot from './iot';
import Request from './request';
import * as sessionTypes from './sessionTypes';

/**
 * An adapter that allows the SDK to authenticate with different services and manage various tokens.
 * Can authenticate with a service like Auth0 and then with Contxt or can communicate directly
 * with Contxt. The adapter must implement required methods, but most methods are optional. Some of
 * the optional methods are documented below.
 *
 * @typedef {Object} SessionType
 * @property {function} [getCurrentAccessToken] Provides a current access token from Auth0 that is
 *   used for profile information and can be used to get API token for Contxt itself
 * @property {function} getCurrentApiToken Provides a current API token that is used across
 *   different Contxt services
 * @property {function} [getProfile] Provides profile information about the current user
 * @property {function} [handleAuthentication] Is called by front-end code in the Auth0 reference
 *  implementation to handle getting the access token from Auth0
 * @property {function} isAuthenticated Tells caller if the current user is authenticated.
 * @property {function} [logIn] Is used by front-end code in the Auth0 reference implementation to
 *   start the sign in process
 * @property {function} [logOut] Is used by the front-end code in the Auth0 reference implementation
 *   to sign the user out
 */

/**
 * ContxtSdk constructor
 *
 * @example
 * import ContxtSdk from '@ndustrial/contxt-sdk';
 * import ExternalModule1 from './ExternalModule1';
 * import history from '../services/history';
 *
 * const contxtSdk = new ContxtSdk({
 *   config: {
 *     auth: {
 *       clientId: 'Auth0 client id of the application being built',
 *       customModuleConfigs: {
 *         facilities: {
 *           env: 'production'
 *         }
 *       },
 *       env: 'staging',
 *       onRedirect: (pathname) => history.push(pathname)
 *     }
 *   },
 *   externalModules: {
 *     externalModule1: {
 *       clientId: 'Auth0 client id of the external module',
 *       host: 'https://www.example.com/externalModule1',
 *       module: ExternalModule1
 *     }
 *   },
 *   sessionType: 'auth0WebAuth'
 * });
 */
class ContxtSdk {
  /**
   * @param {UserConfig} config The user provided configuration options
   * @param {Object.<string, ExternalModule>} [externalModules] User provided external modules that
   *   should be treated as first class citizens
   * @param {string} sessionType The type of auth session you wish to use (e.g. auth0WebAuth
   *   or machine)
   */
  constructor({ config = {}, externalModules = {}, sessionType }) {
    this.config = new Config(config, externalModules);

    this.assets = new Assets(this, this._createRequest('facilities'));
    this.auth = this._createAuthSession(sessionType);
    this.bus = new Bus(this, this._createRequest('bus'));
    this.coordinator = new Coordinator(
      this,
      this._createRequest('coordinator')
    );
    this.events = new Events(this, this._createRequest('events'));
    this.facilities = new Facilities(this, this._createRequest('facilities'));
    this.files = new Files(this, this._createRequest('files'));
    this.iot = new Iot(this, this._createRequest('iot'));

    this._decorate(externalModules);
  }

  /**
   * Returns a new instance of the session type requested
   *
   * @param {string} sessionType
   *
   * @returns {SessionType} sessionType
   * @throws {Error}
   *
   * @private
   */
  _createAuthSession(sessionType) {
    switch (sessionType) {
      case sessionTypes.TYPES.AUTH0_WEB_AUTH:
        return new sessionTypes.Auth0WebAuth(this);

      case sessionTypes.TYPES.MACHINE_AUTH:
        return new sessionTypes.MachineAuth(this);

      default:
        throw new Error('Invalid sessionType provided');
    }
  }

  /**
   * Returns an instance of the Request module that is tied to the requested audience
   *
   * @param {string} audienceName The audience name of the service you are trying to reach
   *   (e.g. facilities or feeds)
   *
   * @returns {Object} Request module
   *
   * @private
   */
  _createRequest(audienceName) {
    return new Request(this, audienceName);
  }

  /**
   * Decorates custom modules onto the SDK instance so they behave as first-class citizens.
   *
   * @param {Object} modules
   * @param {function} modules.module
   *
   * @private
   */
  _decorate(modules) {
    Object.keys(modules).forEach((moduleName) => {
      this[moduleName] = new modules[moduleName].module(
        this,
        this._createRequest(moduleName)
      );
    });
  }
}

export default ContxtSdk;
