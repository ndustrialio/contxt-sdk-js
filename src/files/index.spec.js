import Files from './index';
import * as objectUtils from '../utils/objects';

describe('Files', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    this.sandbox = sandbox.create();

    baseRequest = {
      delete: this.sandbox.stub().resolves(),
      get: this.sandbox.stub().resolves(),
      post: this.sandbox.stub().resolves(),
      put: this.sandbox.stub().resolves()
    };

    baseSdk = {
      config: {
        audiences: {
          files: fixture.build('audience')
        }
      }
    };
    expectedHost = faker.internet.url();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('constructor', function() {
    let files;

    beforeEach(function() {
      files = new Files(baseSdk, baseRequest);
    });

    it('sets a base url for the class instance', function() {
      expect(files._baseUrl).to.equal(
        `${baseSdk.config.audiences.files.host}/v1`
      );
    });

    it('appends the supplied request module to the class instance', function() {
      expect(files._request).to.deep.equal(baseRequest);
    });

    it('appends the supplied sdk to the class instance', function() {
      expect(files._sdk).to.deep.equal(baseSdk);
    });
  });

  describe('download', function() {
    context('the file ID is provided', function() {
      let fileFromServerAfterFormat;
      let fileFromServerBeforeFormat;
      let expectedFileId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedFileId = faker.random.uuid();
        fileFromServerAfterFormat = fixture.build('fileToDownload');

        fileFromServerBeforeFormat = fixture.build(
          'file',
          fileFromServerAfterFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(fileFromServerBeforeFormat)
        };

        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(fileFromServerAfterFormat);

        const files = new Files(baseSdk, request);
        files._baseUrl = expectedHost;

        promise = files.download(expectedFileId);
      });

      it('gets the file from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/files/${expectedFileId}/download`
        );
      });

      it('formats the file object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(fileFromServerBeforeFormat);
        });
      });

      it('returns the requested file', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          fileFromServerAfterFormat
        );
      });
    });

    context('the file Id is not provided', function() {
      it('throws an error', function() {
        const files = new Files(baseSdk, baseRequest);
        const promise = files.download();

        return expect(promise).to.be.rejectedWith(
          'A file ID is required for downloading a file'
        );
      });
    });
  });

  describe('get', function() {
    context('the file ID is provided', function() {
      let fileFromServerAfterFormat;
      let fileFromServerBeforeFormat;
      let expectedFileId;
      let promise;
      let request;
      let toCamelCase;

      beforeEach(function() {
        expectedFileId = faker.random.uuid();
        fileFromServerAfterFormat = fixture.build('file', {
          id: expectedFileId
        });

        fileFromServerBeforeFormat = fixture.build(
          'file',
          fileFromServerAfterFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          get: this.sandbox.stub().resolves(fileFromServerBeforeFormat)
        };

        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .returns(fileFromServerAfterFormat);

        const files = new Files(baseSdk, request);
        files._baseUrl = expectedHost;

        promise = files.get(expectedFileId);
      });

      it('gets the file from the server', function() {
        expect(request.get).to.be.calledWith(
          `${expectedHost}/files/${expectedFileId}`
        );
      });

      it('formats the file object', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(fileFromServerBeforeFormat);
        });
      });

      it('returns the requested file', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          fileFromServerAfterFormat
        );
      });
    });

    context('the file Id is not provided', function() {
      it('throws an error', function() {
        const files = new Files(baseSdk, baseRequest);
        const promise = files.get();

        return expect(promise).to.be.rejectedWith(
          'A file ID is required for getting information about a file'
        );
      });
    });
  });
});
