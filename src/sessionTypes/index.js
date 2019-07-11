const TYPES = {
  AUTH0_WEB_AUTH: 'auth0WebAuth',
  MACHINE_AUTH: 'machineAuth',
  PASSWORD_GRANT_AUTH: 'passwordGrantAuth'
};

function Auth0WebAuth(...args) {
  const Auth = require('./auth0WebAuth').default;

  return new Auth(...args);
}

function MachineAuth(...args) {
  const Auth = require('./machineAuth').default;

  return new Auth(...args);
}

function PasswordGrantAuth(...args) {
  const Auth = require('./passwordGrantAuth').default;

  return new Auth(...args);
}

export { Auth0WebAuth, MachineAuth, PasswordGrantAuth, TYPES };
