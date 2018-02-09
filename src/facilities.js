const baseUrl = 'https://facilities.api.ndustrial.io/v1';

class Facilities {
  constructor(sdk) {
    this._sdk = sdk;
  }

  getAll() {
    return this._sdk.request.get(`${baseUrl}/facilities`)
      .then(({ data }) => data);
  }
}

export default Facilities;
