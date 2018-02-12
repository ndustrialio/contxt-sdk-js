const baseUrl = 'https://facilities.api.ndustrial.io/v1';

class Facilities {
  constructor(sdk, request) {
    this._request = request;
    this._sdk = sdk;
  }

  getAll() {
    return this._request.get(`${baseUrl}/facilities`)
      .then(({ data }) => data);
  }
}

export default Facilities;
