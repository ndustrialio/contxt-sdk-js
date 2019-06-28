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
        getCurrentApiToken: sinon.stub().resolves(expectedAccessToken)
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
    let expectedAudienceName;
    let expectedConsentId;

    beforeEach(function() {
      expectedAudienceName = faker.hacker.noun();
      expectedConsentId = faker.random.uuid();
      consent = new Consent(baseSdk, baseRequest, expectedHost);
    });

    context('when all the required parameters are provided', function() {
      let promise;

      beforeEach(function() {
        promise = consent.accept(expectedAudienceName, expectedConsentId);
      });

      it('requests the current accessToken for the given audience name', function() {
        expect(baseSdk.auth.getCurrentApiToken).to.be.calledOnce.and.calledWith(
          expectedAudienceName
        );
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
        const promise = consent.accept(expectedAudienceName, null);

        return expect(promise).to.be.rejectedWith(
          'A consent ID is required for accepting consent'
        );
      });
    });

    context('when an audience name is not provided', function() {
      it('throws an error', function() {
        const promise = consent.accept(null, expectedConsentId);

        return expect(promise).to.be.rejectedWith(
          'An audience name is required for accepting consent'
        );
      });
    });

    context('when an access token is not found for an audience', function() {
      it('throws an error', function() {
        baseSdk.auth.getCurrentApiToken = sinon.stub().resolves(null);
        consent = new Consent(baseSdk, baseRequest, expectedHost);

        const promise = consent.accept(expectedAudienceName, expectedConsentId);

        return expect(promise).to.be.rejectedWith(
          `A valid JWT token for the audience ${expectedAudienceName} is required`
        );
      });
    });
  });

  describe('verify', function() {
    let consent;
    let expectedAudienceName;

    beforeEach(function() {
      expectedAudienceName = faker.hacker.noun();
      consent = new Consent(baseSdk, baseRequest, expectedHost);
    });

    context('when all the required parameters are provided', function() {
      let promise;

      beforeEach(function() {
        promise = consent.verify(expectedAudienceName);
      });

      it('requests the current accessToken for the given audience name', function() {
        expect(baseSdk.auth.getCurrentApiToken).to.be.calledOnce.and.calledWith(
          expectedAudienceName
        );
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

    context('when an audience name is not provided', function() {
      it('throws an error', function() {
        const promise = consent.verify(null);

        return expect(promise).to.be.rejectedWith(
          'An audience name is required for verifying consent'
        );
      });
    });

    context('when an access token is not found for an audience', function() {
      it('throws an error', function() {
        baseSdk.auth.getCurrentApiToken = sinon.stub().resolves(null);
        consent = new Consent(baseSdk, baseRequest, expectedHost);

        const promise = consent.verify(expectedAudienceName);

        return expect(promise).to.be.rejectedWith(
          `A valid JWT token for the audience ${expectedAudienceName} is required`
        );
      });
    });
  });
});
