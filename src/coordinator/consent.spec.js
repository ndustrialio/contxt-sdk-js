import Consent from './consent';

describe('Coordinator/Consent', function() {
  let baseRequest;
  let baseSdk;
  let expectedAccessToken;
  let expectedHost;

  beforeEach(function() {
    expectedAccessToken = faker.internet.password();

    baseRequest = {
      delete: sinon.stub().resolves(),
      get: sinon.stub().resolves(),
      post: sinon.stub().resolves(),
      put: sinon.stub().resolves()
    };
    baseSdk = {
      config: {
        audiences: {
          coordinator: fixture.build('audience')
        }
      },
      auth: {
        _getStoredSession: sinon.stub().returns({
          accessToken: expectedAccessToken
        })
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    let consent;

    beforeEach(function() {
      consent = new Consent(baseSdk, baseRequest, expectedHost);
    });

    it('sets a base url for the class instance', function() {
      expect(consent._baseUrl).to.equal(expectedHost);
    });

    it('appends the supplied request module to the class instance', function() {
      expect(consent._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(consent._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('accept', function() {
    let consent;
    let expectedConsentId;

    beforeEach(function() {
      expectedConsentId = faker.random.uuid();
      consent = new Consent(baseSdk, baseRequest, expectedHost);
    });

    context('when all the required parameters are provided', function() {
      let promise;

      beforeEach(function() {
        promise = consent.accept(expectedConsentId);
      });

      it('requests the current accessToken', function() {
        expect(baseSdk.auth._getStoredSession).to.be.calledOnce;
      });

      it('makes a request to the server', function() {
        return promise.then(() => {
          expect(baseRequest.post).to.be.calledOnce.and.calledWith(
            `${expectedHost}/consents/${expectedConsentId}/accept`,
            {
              access_token: expectedAccessToken
            }
          );
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when a consent id is not provided', function() {
      it('throws an error', function() {
        const promise = consent.accept(null);

        return expect(promise).to.be.rejectedWith(
          'A consent ID is required for accepting consent'
        );
      });
    });

    context('when an access token is not found', function() {
      it('throws an error', function() {
        baseSdk.auth._getStoredSession = sinon.stub().returns({});
        consent = new Consent(baseSdk, baseRequest, expectedHost);

        const promise = consent.accept(expectedConsentId);

        return expect(promise).to.be.rejectedWith(
          `A valid JWT token is required`
        );
      });
    });
  });

  describe('verify', function() {
    let consent;

    beforeEach(function() {
      consent = new Consent(baseSdk, baseRequest, expectedHost);
    });

    context('when all the required parameters are provided', function() {
      let promise;

      beforeEach(function() {
        promise = consent.verify();
      });

      it('requests the current accessToken', function() {
        expect(baseSdk.auth._getStoredSession).to.be.calledOnce;
      });

      it('makes a request to the server', function() {
        return promise.then(() => {
          expect(baseRequest.post).to.be.calledOnce.and.calledWith(
            `${expectedHost}/applications/consent`,
            {
              access_token: expectedAccessToken
            }
          );
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when an access token is not found', function() {
      it('throws an error', function() {
        baseSdk.auth._getStoredSession = sinon.stub().returns({});
        consent = new Consent(baseSdk, baseRequest, expectedHost);

        const promise = consent.verify();

        return expect(promise).to.be.rejectedWith(
          `A valid JWT token is required`
        );
      });
    });
  });
});
