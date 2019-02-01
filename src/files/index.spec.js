import Files from './index';
import * as objectUtils from '../utils/objects';
import * as paginationUtils from '../utils/pagination';

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

  describe('delete', function() {
    context('the file ID is provided', function() {
      let expectedFile;
      let promise;
      let request;

      beforeEach(function() {
        expectedFile = fixture.build('file');

        request = {
          ...baseRequest,
          delete: this.sandbox.stub().resolves()
        };

        const files = new Files(baseSdk, request);
        files._baseUrl = expectedHost;

        promise = files.delete(expectedFile.id);
      });

      it('deletes the file from the server', function() {
        return promise.then(() => {
          expect(request.delete).to.be.calledWith(
            `${expectedHost}/files/${expectedFile.id}`
          );
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('the file ID is not provided', function() {
      it('returns a rejected promise with an error', function() {
        const files = new Files(baseSdk, baseRequest);
        const promise = files.delete();

        return expect(promise).to.be.rejectedWith(
          'A file ID is required to delete a file'
        );
      });
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

  describe('getAll', function() {
    let filesFromServerAfterFormat;
    let filesFromServerBeforeFormat;
    let formatPaginatedDataFromServer;
    let filesFiltersAfterFormat;
    let filesFiltersBeforeFormat;
    let promise;
    let request;
    let toSnakeCase;

    beforeEach(function() {
      filesFromServerAfterFormat = {
        _metadata: fixture.build('paginationMetadata'),
        records: fixture.buildList(
          'file',
          faker.random.number({ min: 1, max: 10 })
        )
      };
      filesFromServerBeforeFormat = {
        ...filesFromServerAfterFormat,
        records: filesFromServerAfterFormat.records.map((asset) =>
          fixture.build('file', asset, { fromServer: true })
        )
      };
      filesFiltersBeforeFormat = {
        limit: faker.random.number({ min: 10, max: 1000 }),
        offset: faker.random.number({ max: 1000 }),
        orderBy: faker.random.arrayElement([
          'content_type',
          'created_at',
          'description',
          'filename',
          'id',
          'organization_id',
          'owner_id',
          'status',
          'updated_at'
        ]),
        reverseOrder: faker.random.boolean(),
        status: faker.random.arrayElement(['ACTIVE', 'UPLOADING'])
      };
      filesFiltersAfterFormat = {
        ...filesFiltersBeforeFormat
      };

      formatPaginatedDataFromServer = this.sandbox
        .stub(paginationUtils, 'formatPaginatedDataFromServer')
        .returns(filesFromServerAfterFormat);
      request = {
        ...baseRequest,
        get: this.sandbox.stub().resolves(filesFromServerBeforeFormat)
      };
      toSnakeCase = this.sandbox
        .stub(objectUtils, 'toSnakeCase')
        .returns(filesFiltersAfterFormat);

      const files = new Files(baseSdk, request);
      files._baseUrl = expectedHost;

      promise = files.getAll(filesFiltersBeforeFormat);
    });

    it('formats the filter options', function() {
      return promise.then(() => {
        expect(toSnakeCase).to.be.calledWith(filesFiltersBeforeFormat);
      });
    });

    it('gets a list of files from the server', function() {
      return promise.then(() => {
        expect(request.get).to.be.calledWith(`${expectedHost}/files`, {
          params: filesFiltersAfterFormat
        });
      });
    });

    it('formats the files data', function() {
      return promise.then(() => {
        expect(formatPaginatedDataFromServer).to.be.calledWith(
          filesFromServerBeforeFormat
        );
      });
    });

    it('returns a list of files', function() {
      return expect(promise).to.be.fulfilled.and.to.eventually.equal(
        filesFromServerAfterFormat
      );
    });
  });
});
