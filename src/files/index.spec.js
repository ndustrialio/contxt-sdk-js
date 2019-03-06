import axios from 'axios';
import omit from 'lodash.omit';
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

  describe('create', function() {
    context('when successfully creating file', function() {
      let fileInfoFromServerAfterFormat;
      let fileInfoFromServerBeforeFormat;
      let fileInfoToServerAfterFormat;
      let fileInfoToServerBeforeFormat;
      let promise;
      let request;
      let toCamelCase;
      let toSnakeCase;

      beforeEach(function() {
        fileInfoFromServerAfterFormat = fixture.build('file');
        fileInfoFromServerBeforeFormat = fixture.build(
          'file',
          fileInfoFromServerAfterFormat,
          { fromServer: true }
        );
        fileInfoToServerBeforeFormat = fixture.build('file');
        fileInfoToServerAfterFormat = fixture.build(
          'file',
          fileInfoToServerBeforeFormat,
          { fromServer: true }
        );

        request = {
          ...baseRequest,
          post: this.sandbox.stub().resolves(fileInfoFromServerBeforeFormat)
        };
        toCamelCase = this.sandbox
          .stub(objectUtils, 'toCamelCase')
          .onFirstCall()
          .returns(omit(fileInfoFromServerAfterFormat, ['uploadInfo']))
          .onSecondCall()
          .returns(fileInfoFromServerAfterFormat.uploadInfo);
        toSnakeCase = this.sandbox
          .stub(objectUtils, 'toSnakeCase')
          .returns(fileInfoToServerAfterFormat);

        const files = new Files(baseSdk, request);
        files._baseUrl = expectedHost;

        promise = files.create(fileInfoToServerBeforeFormat);
      });

      it('formats the file info for the API', function() {
        expect(toSnakeCase).to.be.calledWith(fileInfoToServerBeforeFormat);
      });

      it('creates the file record', function() {
        expect(request.post).to.be.calledWith(
          `${expectedHost}/files`,
          fileInfoToServerAfterFormat
        );
      });

      it('formats the returned file record', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(
            omit(fileInfoFromServerBeforeFormat, ['upload_info'])
          );
        });
      });

      it('formats the upload info in a way that does not mangle the headers information', function() {
        return promise.then(() => {
          expect(toCamelCase).to.be.calledWith(
            fileInfoFromServerBeforeFormat.upload_info,
            { deep: false, excludeTransform: ['headers'] }
          );
        });
      });

      it('resolves with the newly created and formatted file record', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.deep.equal(
          fileInfoFromServerAfterFormat
        );
      });
    });

    context('when there is a failure while creating the file', function() {
      let expectedError;
      let promise;
      let toCamelCase;

      beforeEach(function() {
        expectedError = new Error();
        const fileInfo = fixture.build('file');

        const request = {
          ...baseRequest,
          post: this.sandbox.stub().rejects(expectedError)
        };
        toCamelCase = this.sandbox.stub(objectUtils, 'toCamelCase');
        this.sandbox.stub(objectUtils, 'toSnakeCase');

        const files = new Files(baseSdk, request);
        files._baseUrl = expectedHost;

        promise = files.create(fileInfo);
      });

      it('does not format the returned file record', function() {
        return promise.then(expect.fail).catch(() => {
          expect(toCamelCase).to.not.be.called;
        });
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });

    context('when missing required metadata', function() {
      ['contentType', 'filename', 'organizationId'].forEach(function(field) {
        context(`when missing the ${field}`, function() {
          let promise;

          beforeEach(function() {
            const fileInfo = fixture.build('file');

            const files = new Files(baseSdk, baseRequest);
            files._baseUrl = expectedHost;

            promise = files.create(omit(fileInfo, [field]));
          });

          it('does not create the file record', function() {
            return promise.then(expect.fail).catch(() => {
              expect(baseRequest.post).to.not.be.called;
            });
          });

          it('returns a rejected promise', function() {
            return expect(promise).to.be.rejectedWith(
              `A ${field} is required to create a file`
            );
          });
        });
      });
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

  describe('upload', function() {
    context('successfully uploading a file', function() {
      let fileData;
      let fileInfo;
      let promise;
      let put;

      beforeEach(function() {
        fileData = faker.image.dataUri();
        fileInfo = fixture.build('file');

        put = this.sandbox.stub(axios, 'put').resolves();

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.upload({
          data: fileData,
          headers: fileInfo.uploadInfo.headers,
          url: fileInfo.uploadInfo.url
        });
      });

      it('uploads the file', function() {
        return promise.then(() => {
          expect(put).to.be.calledWith(fileInfo.uploadInfo.url, fileData, {
            headers: fileInfo.uploadInfo.headers
          });
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('failure while uploading a file', function() {
      let expectedError;
      let promise;

      beforeEach(function() {
        const fileData = faker.image.dataUri();
        const fileInfo = fixture.build('file');
        expectedError = new Error();

        this.sandbox.stub(axios, 'put').rejects(expectedError);

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.upload({
          data: fileData,
          headers: fileInfo.uploadInfo.headers,
          url: fileInfo.uploadInfo.url
        });
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });

    ['data', 'url'].forEach(function(field) {
      context(`when missing the required ${field}`, function() {
        let promise;
        let put;

        beforeEach(function() {
          const fileData = faker.image.dataUri();
          const fileInfo = fixture.build('file');

          put = this.sandbox.stub(axios, 'put').resolves();

          const files = new Files(baseSdk, baseRequest);
          files._baseUrl = expectedHost;

          promise = files.upload(
            omit(
              {
                data: fileData,
                headers: fileInfo.uploadInfo.headers,
                url: fileInfo.uploadInfo.url
              },
              [field]
            )
          );
        });

        it('does not attempt to upload the file', function() {
          return promise.then(expect.fail).catch(() => {
            expect(put).to.not.be.called;
          });
        });

        it('returns a rejected promise', function() {
          return expect(promise).to.be.rejectedWith(
            `A ${field} is required to upload a file`
          );
        });
      });
    });
  });
});
