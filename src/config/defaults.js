export default {
  auth: {
    authorizationPath: '/callback',
    tokenExpiresAtBufferMs: 5 * 60 * 1000 // 5 minutes
  },
  interceptors: {
    request: [],
    response: []
  }
};
