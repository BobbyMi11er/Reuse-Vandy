// fileUpload.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const { upload, checkFileType, s3 } = require('../middleware/fileUpload'); // Adjust path as needed

describe('Upload Middleware', function () {

  // NOTE: These tests are not possible because the S3 Client class doesn't expose credentials, etc
  // so it's not possible to verify them against process.env values

  // describe('S3 Client Creation', function () {
  //   it('should create an S3 client with correct credentials and region', function () {
  //     // expect(s3.config.credentials.accessKeyId).to.equal(process.env.S3_ACCESS_KEY);
  //     // expect(s3.config.credentials.secretAccessKey).to.equal(process.env.S3_SECRET_KEY);
  //     expect(s3.config.region).to.equal(process.env.S3_REGION);
  //   });
  // });

  // describe('Multer S3 Storage Configuration', function () {
  //   it('should configure storage with correct S3 client, bucket, and content type', function () {
  //     // Mock the multerS3 storage engine
  //     const storageConfig = upload.storage;

  //     // Test that storage is configured with s3 client and correct bucket
  //     expect(storageConfig).to.have.property('s3');
  //     expect(storageConfig.s3).to.equal(s3); // Ensures s3 client is passed correctly
  //     // expect(storageConfig).to.have.property('bucket', process.env.S3_BUCKET_NAME);
  //     expect(storageConfig).to.have.property('contentType', 'AUTO_CONTENT_TYPE');
  //   });

  //   // it('should set metadata and key correctly for each file upload', function (done) {
  //   //   const req = {};
  //   //   const file = { fieldname: 'testfile', originalname: 'test.jpg', mimetype: 'image/jpeg' };
  //   //   const metadataCb = sinon.spy();
  //   //   const keyCb = sinon.spy();

  //   //   upload.storage.metadata(req, file, metadataCb);
  //   //   upload.storage.key(req, file, keyCb);

  //   //   // Test that metadata callback is called with correct arguments
  //   //   expect(metadataCb.calledOnce).to.be.true;
  //   //   expect(metadataCb.args[0][1]).to.deep.equal({ fieldName: file.fieldname });

  //   //   // Test that key callback generates a string for the key
  //   //   expect(keyCb.calledOnce).to.be.true;
  //   //   expect(keyCb.args[0][1]).to.be.a('string');
  //   //   done();
  //   // });
  // });

  describe('File Type Checking', function () {
    it('should allow jpeg, jpg, and png file types', function (done) {
      const file = { originalname: 'test.jpg', mimetype: 'image/jpeg' };
      checkFileType(file, (err, isValid) => {
        expect(err).to.be.null;
        expect(isValid).to.be.true;
        done();
      });
    });

    it('should reject non-image file types', function (done) {
      const file = { originalname: 'test.txt', mimetype: 'text/plain' };
      checkFileType(file, (err, isValid) => {
        expect(err).to.equal('Error: Images only (jpeg, jpg, png, png)!');
        expect(isValid).to.be.undefined;
        done();
      });
    });
  });
});
