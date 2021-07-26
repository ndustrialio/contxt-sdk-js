import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  useQuery
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

class Apollo {
  /**
   * @param {Object} sdk An instance of the SDK so the module can communicate with other modules
   * @param {string} audienceName The audience name for this instance. Used when grabbing a
   *   Bearer token
   */
  constructor(sdk, audienceName) {
    const httpLink = createHttpLink({
      uri: `${sdk.config.audiences[audienceName].host}/v1/graphql`
    });
    const authLink = setContext((_, { headers }) => {
      return sdk.auth.getCurrentApiToken(audienceName).then((apiToken) => {
        return {
          headers: {
            ...headers,
            authorization: apiToken ? `Bearer ${apiToken}` : null
          }
        };
      });
    });

    this._client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });
  }

  useQuery(query, queryHookOptions) {
    return useQuery(query, { queryHookOptions, ...{ client: this._client } });
  }
}

export default Apollo;
