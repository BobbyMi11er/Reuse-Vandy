const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../server'); // Adjust the path to your main server file

describe('Home Route', () => {
    it('should return the API running message', async () => {
        const res = await supertest(app)
            .get('/')  // Testing the root endpoint
            .expect(200);  // Expecting HTTP status 200

        // Log the response body for debugging (optional)
        console.log('Response body:', res.text);

        // Make assertions about the response
        expect(res.text).to.equal('ReuseVandy API is running!');
    });
});
