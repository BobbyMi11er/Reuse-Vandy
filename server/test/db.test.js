// db.test.js
require('dotenv').config({ path: '.env.test' });
const mysql = require('mysql2/promise');
const { expect } = require('chai');
const sinon = require('sinon');
const pool = require('../connection'); // adjust path as needed

describe('Database Connection Pool', function () {
  let getConnectionStub;

  before(function () {
    // Stub the pool.getConnection method to simulate connection
    getConnectionStub = sinon.stub(pool, 'getConnection').callsFake(async () => ({
      release: () => {}, // Simulate the release function
    }));
  });

  after(function () {
    getConnectionStub.restore(); // Restore original function
  });

  it('should establish a successful connection', async function () {
    try {
      const connection = await pool.getConnection();
      expect(connection).to.have.property('release');
      console.log('Database connected successfully');
    } catch (error) {
      throw new Error('Failed to connect to the database');
    }
  });

  it('should throw an error if connection fails', async function () {
    getConnectionStub.restore(); // Remove the previous stub
    getConnectionStub = sinon.stub(pool, 'getConnection').rejects(new Error('Connection failed'));

    try {
      await pool.getConnection();
    } catch (error) {
      expect(error.message).to.equal('Connection failed');
    }
  });
});
