// verifyToken.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const { verifyToken } = require('../firebase/verifyToken'); // Adjust path as needed
const { auth } = require('../firebase/firebase-config'); // Adjust path as needed

describe('verifyToken Middleware', function () {
  let req, res, next, verifyIdTokenStub;

  beforeEach(function () {
    req = { headers: { authorization: '' }, body: {} };
    res = {};
    next = sinon.spy();
    verifyIdTokenStub = sinon.stub(auth, 'verifyIdToken');
  });

  afterEach(function () {
    verifyIdTokenStub.restore(); // Restore original function after each test
  });

  it('should throw an error if token is missing', async function () {
    req.headers.authorization = '';

    await verifyToken(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.an('error').with.property('message', 'Token not found');
  });

  it('should throw an error if token verification fails', async function () {
    req.headers.authorization = 'Bearer fake_token';
    verifyIdTokenStub.rejects(new Error('Token verification failed'));

    await verifyToken(req, res, next);
    expect(verifyIdTokenStub.calledOnceWith('fake_token')).to.be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.an('error').with.property('message', 'Token verification failed');
  });

  it('should throw an error if verifyIdToken resolves with null or undefined', async function () {
    req.headers.authorization = 'Bearer invalid_token';
    verifyIdTokenStub.resolves(null); // Simulate verifyIdToken resolving with null

    await verifyToken(req, res, next);
    expect(verifyIdTokenStub.calledOnceWith('invalid_token')).to.be.true;
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.be.an('error').with.property('message', 'Token verification failed');
    });


  it('should call next with no error and set req.body.user if token is valid', async function () {
    req.headers.authorization = 'Bearer valid_token';
    const decodedUser = { uid: '123', email: 'user@example.com' };
    verifyIdTokenStub.resolves(decodedUser);

    await verifyToken(req, res, next);
    expect(verifyIdTokenStub.calledOnceWith('valid_token')).to.be.true;
    expect(next.calledOnceWithExactly()).to.be.true; // No error passed to next
    expect(req.body.user).to.deep.equal(decodedUser); // Ensure req.body.user is set correctly
  });
});
