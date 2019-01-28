import Auth0WebAuth, { TYPE as AUTH0_WEB_AUTH } from './auth0WebAuth';
import PasswordGrantAuth, {
  TYPE as PASSWORD_GRANT_AUTH
} from './passwordGrantAuth';
import MachineAuth, { TYPE as MACHINE_AUTH } from './machineAuth';

const TYPES = {
  AUTH0_WEB_AUTH,
  PASSWORD_GRANT_AUTH,
  MACHINE_AUTH
};

export { Auth0WebAuth, PasswordGrantAuth, MachineAuth, TYPES };
