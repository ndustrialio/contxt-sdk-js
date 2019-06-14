import axios from 'axios';
import omit from 'lodash.omit';
import pick from 'lodash.pick';
import Files from './index';
import * as objectUtils from '../utils/objects';
import * as paginationUtils from '../utils/pagination';

describe('Files', function() {
  let baseRequest;
  let baseSdk;
  let expectedHost;

  beforeEach(function() {
    baseRequest = {
      delete: sinon.stub().resolves(),
      get: sinon.stub().resolves(),
      post: sinon.stub().resolves(),
      put: sinon.stub().resolves()
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
    sinon.restore();
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
          post: sinon.stub().resolves(fileInfoFromServerBeforeFormat)
        };
        toCamelCase = sinon
          .stub(objectUtils, 'toCamelCase')
          .onFirstCall()
          .returns(omit(fileInfoFromServerAfterFormat, ['uploadInfo']))
          .onSecondCall()
          .returns(fileInfoFromServerAfterFormat.uploadInfo);
        toSnakeCase = sinon
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
          post: sinon.stub().rejects(expectedError)
        };
        toCamelCase = sinon.stub(objectUtils, 'toCamelCase');
        sinon.stub(objectUtils, 'toSnakeCase');

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

  describe('createAndUpload', function() {
    context('successfully creating and uploading a file', function() {
      let create;
      let expectedFileData;
      let fileInfoFromServer;
      let get;
      let metadataFromServer;
      let metadataToServer;
      let promise;
      let setUploadComplete;
      let upload;

      beforeEach(function() {
        expectedFileData = faker.image.dataUri();
        fileInfoFromServer = fixture.build('file');
        metadataToServer = pick(fixture.build('file', fileInfoFromServer), [
          'contentType',
          'description',
          'filename',
          'organizationId'
        ]);
        metadataFromServer = fixture.build('file', metadataToServer);

        create = sinon
          .stub(Files.prototype, 'create')
          .resolves(metadataFromServer);
        get = sinon.stub(Files.prototype, 'get').resolves(fileInfoFromServer);
        setUploadComplete = sinon
          .stub(Files.prototype, 'setUploadComplete')
          .resolves();
        upload = sinon.stub(Files.prototype, 'upload').resolves();

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.createAndUpload({
          data: expectedFileData,
          metadata: metadataToServer
        });
      });

      it('creates a File record', function() {
        return promise.then(() => {
          expect(create).to.be.calledWith(metadataToServer);
        });
      });

      it('uploads the file', function() {
        return promise.then(() => {
          expect(upload).to.be.calledWith({
            data: expectedFileData,
            headers: metadataFromServer.uploadInfo.headers,
            url: metadataFromServer.uploadInfo.url
          });
        });
      });

      it('marks the upload as complete', function() {
        return promise.then(() => {
          expect(setUploadComplete).to.be.calledWith(metadataFromServer.id);
        });
      });

      it('gets a copy of the file record that has the newest state', function() {
        return promise.then(() => {
          expect(get).to.be.calledWith(metadataFromServer.id);
        });
      });

      it('returns a resolved promise with the file record', function() {
        return expect(promise).to.be.fulfilled.and.to.eventually.equal(
          fileInfoFromServer
        );
      });
    });

    context('when there is a failure creating the file record', function() {
      let create;
      let expectedError;
      let expectedFileData;
      let expectedOriginalError;
      let generateError;
      let get;
      let metadataToServer;
      let promise;
      let setUploadComplete;
      let setUploadFailed;
      let upload;

      beforeEach(function() {
        expectedError = new Error(faker.hacker.phrase());
        expectedOriginalError = new Error(faker.hacker.phrase());
        expectedFileData = faker.image.dataUri();
        metadataToServer = pick(fixture.build('file'), [
          'contentType',
          'description',
          'filename',
          'organizationId'
        ]);

        create = sinon
          .stub(Files.prototype, 'create')
          .rejects(expectedOriginalError);
        generateError = sinon
          .stub(Files.prototype, '_generateError')
          .returns(expectedError);
        get = sinon.stub(Files.prototype, 'get').resolves();
        setUploadComplete = sinon
          .stub(Files.prototype, 'setUploadComplete')
          .resolves();
        setUploadFailed = sinon
          .stub(Files.prototype, 'setUploadFailed')
          .resolves();
        upload = sinon.stub(Files.prototype, 'upload').resolves();

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.createAndUpload({
          data: expectedFileData,
          metadata: metadataToServer
        });
      });

      it('attempts to create a File record', function() {
        return promise.then(expect.fail).catch(() => {
          expect(create).to.be.calledWith(metadataToServer);
        });
      });

      it('does not upload the file', function() {
        return promise.then(expect.fail).catch(() => {
          expect(upload).to.not.be.called;
        });
      });

      it('does not mark the upload as complete', function() {
        return promise.then(expect.fail).catch(() => {
          expect(setUploadComplete).to.not.be.called;
        });
      });

      it('does not mark the upload as failed', function() {
        return promise.then(expect.fail).catch(() => {
          expect(setUploadFailed).to.not.be.called;
        });
      });

      it('does not get a copy of the file record that has the newest status', function() {
        return promise.then(expect.fail).catch(() => {
          expect(get).to.not.be.called;
        });
      });

      it('generates a descriptive error', function() {
        return promise.then(expect.fail).catch(() => {
          expect(generateError).to.be.calledWith({
            message: 'There was a problem creating the file. Please try again.',
            originalError: expectedOriginalError,
            stage: 'create'
          });
        });
      });

      it('returns a rejected promise with the error', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });

    context('when there is a failure uploading the file', function() {
      let create;
      let expectedError;
      let expectedFileData;
      let expectedOriginalError;
      let generateError;
      let metadataFromServer;
      let metadataToServer;
      let get;
      let promise;
      let setUploadComplete;
      let setUploadFailed;
      let upload;

      beforeEach(function() {
        expectedFileData = faker.image.dataUri();
        metadataToServer = pick(fixture.build('file'), [
          'contentType',
          'description',
          'filename',
          'organizationId'
        ]);
        metadataFromServer = fixture.build('file', metadataToServer);
        expectedError = new Error(faker.hacker.phrase());
        expectedOriginalError = new Error(faker.hacker.phrase());

        create = sinon
          .stub(Files.prototype, 'create')
          .resolves(metadataFromServer);
        generateError = sinon
          .stub(Files.prototype, '_generateError')
          .returns(expectedError);
        get = sinon.stub(Files.prototype, 'get').resolves();
        setUploadComplete = sinon
          .stub(Files.prototype, 'setUploadComplete')
          .resolves();
        setUploadFailed = sinon
          .stub(Files.prototype, 'setUploadFailed')
          .resolves();
        upload = sinon
          .stub(Files.prototype, 'upload')
          .rejects(expectedOriginalError);

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.createAndUpload({
          data: expectedFileData,
          metadata: metadataToServer
        });
      });

      it('creates a File record', function() {
        return promise.then(expect.fail).catch(() => {
          expect(create).to.be.calledWith(metadataToServer);
        });
      });

      it('attempts to upload the file', function() {
        return promise.then(expect.fail).catch(() => {
          expect(upload).to.be.calledWith({
            data: expectedFileData,
            headers: metadataFromServer.uploadInfo.headers,
            url: metadataFromServer.uploadInfo.url
          });
        });
      });

      it('does not mark the upload as complete', function() {
        return promise.then(expect.fail).catch(() => {
          expect(setUploadComplete).to.not.be.called;
        });
      });

      it('marks the upload as failed', function() {
        return promise.then(expect.fail).catch(() => {
          expect(setUploadFailed).to.be.calledWith(metadataFromServer.id);
        });
      });

      it('does not get a copy of the file record that has the newest status', function() {
        return promise.then(expect.fail).catch(() => {
          expect(get).to.not.be.called;
        });
      });

      it('generates a descriptive error', function() {
        return promise.then(expect.fail).catch(() => {
          expect(generateError).to.be.calledWith({
            createdFile: omit(metadataFromServer, ['uploadInfo']),
            message:
              'There was a problem uploading the file. Please try again.',
            originalError: expectedOriginalError,
            stage: 'upload'
          });
        });
      });

      it('returns a rejected promise with the error', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });

    context('when there is a failure marking the file as uploaded', function() {
      let create;
      let expectedError;
      let expectedFileData;
      let expectedOriginalError;
      let metadataFromServer;
      let metadataToServer;
      let generateError;
      let get;
      let promise;
      let setUploadComplete;
      let setUploadFailed;
      let upload;

      beforeEach(function() {
        expectedFileData = faker.image.dataUri();
        metadataToServer = pick(fixture.build('file'), [
          'contentType',
          'description',
          'filename',
          'organizationId'
        ]);
        metadataFromServer = fixture.build('file', metadataToServer);
        expectedError = new Error(faker.hacker.phrase());
        expectedOriginalError = new Error(faker.hacker.phrase());

        create = sinon
          .stub(Files.prototype, 'create')
          .resolves(metadataFromServer);
        generateError = sinon
          .stub(Files.prototype, '_generateError')
          .returns(expectedError);
        get = sinon.stub(Files.prototype, 'get').resolves();
        setUploadComplete = sinon
          .stub(Files.prototype, 'setUploadComplete')
          .rejects(expectedOriginalError);
        setUploadFailed = sinon
          .stub(Files.prototype, 'setUploadFailed')
          .resolves();
        upload = sinon.stub(Files.prototype, 'upload').resolves();

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.createAndUpload({
          data: expectedFileData,
          metadata: metadataToServer
        });
      });

      it('creates a File record', function() {
        return promise.then(expect.fail).catch(() => {
          expect(create).to.be.calledWith(metadataToServer);
        });
      });

      it('uploads the file', function() {
        return promise.then(expect.fail).catch(() => {
          expect(upload).to.be.calledWith({
            data: expectedFileData,
            headers: metadataFromServer.uploadInfo.headers,
            url: metadataFromServer.uploadInfo.url
          });
        });
      });

      it('attempts to mark the upload as complete', function() {
        return promise.then(expect.fail).catch(() => {
          expect(setUploadComplete).to.be.calledWith(metadataFromServer.id);
        });
      });

      it('does not mark the upload as failed', function() {
        return promise.then(expect.fail).catch(() => {
          expect(setUploadFailed).to.not.be.called;
        });
      });

      it('does not get a copy of the file record that has the newest status', function() {
        return promise.then(expect.fail).catch(() => {
          expect(get).to.not.be.called;
        });
      });

      it('generates a descriptive error', function() {
        return promise.then(expect.fail).catch(() => {
          expect(generateError).to.be.calledWith({
            createdFile: omit(metadataFromServer, ['uploadInfo']),
            message:
              'There was a problem updating the file status. Please try again.',
            originalError: expectedOriginalError,
            stage: 'statusUpdate'
          });
        });
      });

      it('returns a rejected promise with the error', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });

    context(
      'when there is a failure getting an updated copy of the file record',
      function() {
        let create;
        let expectedError;
        let expectedFileData;
        let expectedOriginalError;
        let metadataFromServer;
        let metadataToServer;
        let generateError;
        let get;
        let promise;
        let setUploadComplete;
        let setUploadFailed;
        let upload;

        beforeEach(function() {
          expectedFileData = faker.image.dataUri();
          metadataToServer = pick(fixture.build('file'), [
            'contentType',
            'description',
            'filename',
            'organizationId'
          ]);
          metadataFromServer = fixture.build('file', metadataToServer);
          expectedError = new Error(faker.hacker.phrase());
          expectedOriginalError = new Error(faker.hacker.phrase());

          create = sinon
            .stub(Files.prototype, 'create')
            .resolves(metadataFromServer);
          generateError = sinon
            .stub(Files.prototype, '_generateError')
            .returns(expectedError);
          get = sinon
            .stub(Files.prototype, 'get')
            .rejects(expectedOriginalError);
          setUploadComplete = sinon
            .stub(Files.prototype, 'setUploadComplete')
            .resolves();
          setUploadFailed = sinon
            .stub(Files.prototype, 'setUploadFailed')
            .resolves();
          upload = sinon.stub(Files.prototype, 'upload').resolves();

          const files = new Files(baseSdk, baseRequest);
          files._baseUrl = expectedHost;

          promise = files.createAndUpload({
            data: expectedFileData,
            metadata: metadataToServer
          });
        });

        it('creates a File record', function() {
          return promise.then(expect.fail).catch(() => {
            expect(create).to.be.calledWith(metadataToServer);
          });
        });

        it('uploads the file', function() {
          return promise.then(expect.fail).catch(() => {
            expect(upload).to.be.calledWith({
              data: expectedFileData,
              headers: metadataFromServer.uploadInfo.headers,
              url: metadataFromServer.uploadInfo.url
            });
          });
        });

        it('marks the upload as complete', function() {
          return promise.then(expect.fail).catch(() => {
            expect(setUploadComplete).to.be.calledWith(metadataFromServer.id);
          });
        });

        it('does not mark the upload as failed', function() {
          return promise.then(expect.fail).catch(() => {
            expect(setUploadFailed).to.not.be.called;
          });
        });

        it('attempts to get a copy of the file record that has the newest status', function() {
          return promise.then(expect.fail).catch(() => {
            expect(get).to.be.calledWith(metadataFromServer.id);
          });
        });

        it('generates a descriptive error', function() {
          return promise.then(expect.fail).catch(() => {
            expect(generateError).to.be.calledWith({
              createdFile: omit(metadataFromServer, ['uploadInfo']),
              message:
                'There was a problem getting updated information about the file. Please try again.',
              originalError: expectedOriginalError,
              stage: 'get'
            });
          });
        });

        it('returns a rejected promise with the error', function() {
          return expect(promise).to.be.rejectedWith(expectedError);
        });
      }
    );

    context('when there is missing required information', function() {
      ['data', 'metadata'].forEach(function(field) {
        context(`when missing the \`${field}\` field`, function() {
          let create;
          let expectedError;
          let generateError;
          let get;
          let promise;
          let setUploadComplete;
          let setUploadFailed;
          let upload;

          beforeEach(function() {
            expectedError = new Error(faker.hacker.phrase());

            create = sinon.stub(Files.prototype, 'create').resolves();
            generateError = sinon
              .stub(Files.prototype, '_generateError')
              .returns(expectedError);
            get = sinon.stub(Files.prototype, 'get').resolves();
            setUploadComplete = sinon
              .stub(Files.prototype, 'setUploadComplete')
              .resolves();
            setUploadFailed = sinon
              .stub(Files.prototype, 'setUploadFailed')
              .resolves();
            upload = sinon.stub(Files.prototype, 'upload').resolves();

            const files = new Files(baseSdk, baseRequest);
            files._baseUrl = expectedHost;

            promise = files.createAndUpload(
              omit(
                {
                  data: faker.image.dataUri(),
                  metadata: pick(fixture.build('file'), [
                    'contentType',
                    'description',
                    'filename',
                    'organizationId'
                  ])
                },
                [field]
              )
            );
          });

          it('does not create a File record', function() {
            return promise.then(expect.fail).catch(() => {
              expect(create).to.not.be.called;
            });
          });

          it('does not upload the file', function() {
            return promise.then(expect.fail).catch(() => {
              expect(upload).to.not.be.called;
            });
          });

          it('does not mark the upload as complete', function() {
            return promise.then(expect.fail).catch(() => {
              expect(setUploadComplete).to.not.be.called;
            });
          });

          it('does not mark the upload as failed', function() {
            return promise.then(expect.fail).catch(() => {
              expect(setUploadFailed).to.not.be.called;
            });
          });

          it('does not get a copy of the file record that has the newest status', function() {
            return promise.then(expect.fail).catch(() => {
              expect(get).to.not.be.called;
            });
          });

          it('generates a descriptive error', function() {
            return promise.then(expect.fail).catch(() => {
              expect(generateError).to.be.calledWith({
                message: `A \`${field}\` field is required to create and upload a file`,
                stage: 'validation'
              });
            });
          });

          it('returns a rejected promise with the error', function() {
            return expect(promise).to.be.rejectedWith(expectedError);
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
          delete: sinon.stub().resolves()
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
          get: sinon.stub().resolves(fileFromServerBeforeFormat)
        };

        toCamelCase = sinon
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
          get: sinon.stub().resolves(fileFromServerBeforeFormat)
        };

        toCamelCase = sinon
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

      formatPaginatedDataFromServer = sinon
        .stub(paginationUtils, 'formatPaginatedDataFromServer')
        .returns(filesFromServerAfterFormat);
      request = {
        ...baseRequest,
        get: sinon.stub().resolves(filesFromServerBeforeFormat)
      };
      toSnakeCase = sinon
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

  describe('setUploadComplete', function() {
    context('when successfully marking the upload as complete', function() {
      let createdFileId;
      let promise;

      beforeEach(function() {
        createdFileId = fixture.build('file').id;

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.setUploadComplete(createdFileId);
      });

      it('sets the upload as complete', function() {
        return promise.then(() => {
          expect(baseRequest.post).to.be.calledWith(
            `${expectedHost}/files/${createdFileId}/complete`
          );
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context(
      'when theres is a failure while marking the upload as complete',
      function() {
        let expectedError;
        let promise;

        beforeEach(function() {
          const createdFileId = fixture.build('file').id;
          expectedError = new Error();

          const request = {
            ...baseRequest,
            post: sinon.stub().rejects(expectedError)
          };

          const files = new Files(baseSdk, request);
          files._baseUrl = expectedHost;

          promise = files.setUploadComplete(createdFileId);
        });

        it('returns a rejected promise', function() {
          return expect(promise).to.be.rejectedWith(expectedError);
        });
      }
    );

    context('when there is no provided file ID', function() {
      let promise;

      beforeEach(function() {
        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.setUploadComplete();
      });

      it('does not set the upload as complete', function() {
        return promise.then(expect.fail).catch(() => {
          expect(baseRequest.post).to.not.be.called;
        });
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(
          'A file ID is required to mark a file upload as complete'
        );
      });
    });
  });

  describe('setUploadFailed', function() {
    context('when successfully marking the upload as failed', function() {
      let expectedFileId;
      let promise;

      beforeEach(function() {
        expectedFileId = fixture.build('file').id;

        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.setUploadFailed(expectedFileId);
      });

      it('sets the upload as failed', function() {
        return promise.then(() => {
          expect(baseRequest.post).to.be.calledWith(
            `${expectedHost}/files/${expectedFileId}/failed`
          );
        });
      });

      it('returns a fulfilled promise', function() {
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when there is a failure marking the upload as failed', function() {
      let expectedError;
      let promise;

      beforeEach(function() {
        const createdFileId = fixture.build('file').id;
        expectedError = new Error();

        const request = {
          ...baseRequest,
          post: sinon.stub().rejects(expectedError)
        };

        const files = new Files(baseSdk, request);
        files._baseUrl = expectedHost;

        promise = files.setUploadFailed(createdFileId);
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(expectedError);
      });
    });

    context('when there is no provided file ID', function() {
      let promise;

      beforeEach(function() {
        const files = new Files(baseSdk, baseRequest);
        files._baseUrl = expectedHost;

        promise = files.setUploadFailed();
      });

      it('does not set the upload as complete', function() {
        return promise.then(expect.fail).catch(() => {
          expect(baseRequest.post).to.not.be.called;
        });
      });

      it('returns a rejected promise', function() {
        return expect(promise).to.be.rejectedWith(
          'A file ID is required to mark a file upload as failed'
        );
      });
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

        put = sinon.stub(axios, 'put').resolves();

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

        sinon.stub(axios, 'put').rejects(expectedError);

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

          put = sinon.stub(axios, 'put').resolves();

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

  describe('_generateError', function() {
    let files;

    beforeEach(function() {
      files = new Files(baseSdk, baseRequest);
      files._baseUrl = expectedHost;
    });

    it('generates a new error with a file artifact and a new message', function() {
      const expectedFileData = faker.image.dataUri();
      const expectedMessage = faker.hacker.phrase();
      const expectedOriginalError = new Error();
      const expectedStage = faker.lorem.word();

      const error = files._generateError({
        createdFile: expectedFileData,
        message: expectedMessage,
        originalError: expectedOriginalError,
        stage: expectedStage
      });

      expect(error).to.be.an('error');
      expect(error.artifacts).to.deep.equal({
        file: expectedFileData
      });
      expect(error.message).to.equal(expectedMessage);
      expect(error.originalError).to.equal(expectedOriginalError);
      expect(error.stage).to.equal(expectedStage);
    });

    it("generates a new error with the original Error's message", function() {
      const expectedFileData = faker.image.dataUri();
      const expectedOriginalError = new Error(faker.hacker.phrase());
      const expectedStage = faker.lorem.word();

      const error = files._generateError({
        createdFile: expectedFileData,
        originalError: expectedOriginalError,
        stage: expectedStage
      });

      expect(error).to.be.an('error');
      expect(error.artifacts).to.deep.equal({
        file: expectedFileData
      });
      expect(error.message).to.equal(expectedOriginalError.message);
      expect(error.originalError).to.equal(expectedOriginalError);
      expect(error.stage).to.equal(expectedStage);
    });

    it('generates a new error with no file artifact', function() {
      const expectedMessage = faker.hacker.phrase();
      const expectedOriginalError = new Error();
      const expectedStage = faker.lorem.word();

      const error = files._generateError({
        message: expectedMessage,
        originalError: expectedOriginalError,
        stage: expectedStage
      });

      expect(error).to.be.an('error');
      expect(error.artifacts).to.deep.equal({});
      expect(error.message).to.equal(expectedMessage);
      expect(error.originalError).to.equal(expectedOriginalError);
      expect(error.stage).to.equal(expectedStage);
    });
  });
});
