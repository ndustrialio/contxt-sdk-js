class Facilities {
  constructor(sdk, request) {
    this._baseUrl = `${sdk.config.audiences.facilities.host}/v1`;
    this._request = request;
    this._sdk = sdk;
  }

  getAll() {
    return this._request.get(`${this._baseUrl}/facilities`)
      .then(({ data }) => data);
  }
}

export default Facilities;
