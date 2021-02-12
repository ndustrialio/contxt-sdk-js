export default {
  auth: {
    domain: 'ndustrial.auth0.com',
    authorizationPath: '/callback',
    tokenExpiresAtBufferMs: 5 * 60 * 1000 // 5 minutes
  },
  interceptors: {
    request: [],
    response: []
  }
};
