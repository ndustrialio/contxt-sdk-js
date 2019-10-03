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
        getCurrentAccessToken: sinon.stub().resolves(expectedAccessToken)
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    context('when an organization ID is provided', function() {
      let consent;
      let organizationId;

      beforeEach(function() {
        organizationId = fixture.build('organization').id;

        consent = new Consent(
          baseSdk,
          baseRequest,
          expectedHost,
          organizationId
        );
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

      it('sets the organization ID for the class instance', function() {
        expect(consent._organizationId).to.equal(organizationId);
      });
    });

    context('when an organization ID is not provided', function() {
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

      it('sets the organization ID for the class instance to null', function() {
        expect(consent._organizationId).to.equal(null);
      });
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
        expect(baseSdk.auth.getCurrentAccessToken).to.be.calledOnce;
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
        baseSdk.auth.getCurrentAccessToken = sinon.stub().resolves();
        consent = new Consent(baseSdk, baseRequest, expectedHost);

        const promise = consent.accept(expectedConsentId);

        return expect(promise).to.be.rejectedWith(
          `A valid JWT token is required`
        );
      });
    });
  });

  describe('getForCurrentApplication', function() {
    let consent;

    beforeEach(function() {
      consent = new Consent(baseSdk, baseRequest, expectedHost);
    });

    context('when all the required parameters are provided', function() {
      let promise;

      beforeEach(function() {
        promise = consent.getForCurrentApplication();
      });

      it('requests the current accessToken', function() {
        expect(baseSdk.auth.getCurrentAccessToken).to.be.calledOnce;
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
        baseSdk.auth.getCurrentAccessToken = sinon.stub().resolves();
        consent = new Consent(baseSdk, baseRequest, expectedHost);

        const promise = consent.getForCurrentApplication();

        return expect(promise).to.be.rejectedWith(
          `A valid JWT token is required`
        );
      });
    });
  });
});
