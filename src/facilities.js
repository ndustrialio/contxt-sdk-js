import Request from './request';

const baseUrl = 'https://facilities.api.ndustrial.io/v1';

class Facilities {
  constructor(sdk) {
    this._request = new Request(sdk, 'facilities');
    this._sdk = sdk;
  }

  getAll() {
    return this._request.get(`${baseUrl}/facilities`)
      .then(({ data }) => data);
  }
}

export default Facilities;
