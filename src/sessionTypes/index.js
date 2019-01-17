import Auth0WebAuth, { TYPE as AUTH0_WEB_AUTH } from './auth0WebAuth';
import CliAuth, { TYPE as CLI_AUTH } from './cliAuth';
import MachineAuth, { TYPE as MACHINE_AUTH } from './machineAuth';

const TYPES = {
  AUTH0_WEB_AUTH,
  CLI_AUTH,
  MACHINE_AUTH
};

export { Auth0WebAuth, CliAuth, MachineAuth, TYPES };
