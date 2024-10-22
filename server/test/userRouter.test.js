const { expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../server'); // Adjust path to your main server file
const pool = require('../connection'); // Your MySQL connection

describe('Users Router', () => {
    let queryStub;

    // Before each test, stub the execute method on the pool
    beforeEach(() => {
        queryStub = sinon.stub(pool, 'execute');
    });

    // After each test, restore the original pool behavior
    afterEach(() => {
        sinon.restore();
    });

    // Test for creating a new user
    it('should create a new user', async () => {
        // Mock the DB response for a successful insert
        queryStub.resolves([{ insertId: 1 }]);

        // Send POST request to /users
        const res = await supertest(app)
            .post('/users')  // Changed to /users
            .send({
                user_firebase_id: 'test_firebase_id',
                name: 'Test User',
                pronoun: 'he/him',
                email: 'test@example.com',
                phone_number: '1234567890',
                profile_img_url: 'https://example.com/profile.jpg'
            })
            .expect(201);  // Expecting HTTP status 201

        // Log the response for debugging purposes
        // console.log('Response body:', res.body);

        // Make assertions on the response
        expect(res.body).to.have.property('user_id', 1);
        expect(res.body).to.have.property('message', 'User inserted');
    });

    // Test for retrieving all users
    it('should retrieve all users', async () => {
        const mockUsers = [
            {
                user_firebase_id: 'user_1',
                name: 'User One',
                pronoun: 'he/him',
                email: 'user1@example.com',
                phone_number: '1234567890',
                profile_img_url: 'https://example.com/user1.jpg'
            },
            {
                user_firebase_id: 'user_2',
                name: 'User Two',
                pronoun: 'she/her',
                email: 'user2@example.com',
                phone_number: '9876543210',
                profile_img_url: 'https://example.com/user2.jpg'
            }
        ];

        // Mock the DB response for all users
        queryStub.resolves([mockUsers]);

        // Send GET request to /users
        const res = await supertest(app)
            .get('/users')  // Changed to /users
            .expect(200);  // Expecting HTTP status 200

        // Assert response data
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(2);
        expect(res.body[0]).to.deep.equal(mockUsers[0]);
        expect(res.body[1]).to.deep.equal(mockUsers[1]);
    });

    // Test for retrieving a user by user_firebase_id
    it('should retrieve a user by user_firebase_id', async () => {
        const mockUser = {
            user_firebase_id: 'test_firebase_id',
            name: 'Test User',
            pronoun: 'he/him',
            email: 'test@example.com',
            phone_number: '1234567890',
            profile_img_url: 'https://example.com/profile.jpg'
        };

        // Mock the DB response for a single user
        queryStub.resolves([[mockUser]]);

        // Send GET request to /users/:user_firebase_id
        const res = await supertest(app)
            .get('/users/test_firebase_id')  // Changed to /users
            .expect(200);  // Expecting HTTP status 200

        // Assert response data
        expect(res.body).to.deep.equal(mockUser);
    });

    // Test for updating an existing user
    it('should update an existing user', async () => {
        // Mock the DB response for a successful update
        queryStub.resolves([{ affectedRows: 1 }]);

        // Send POST request to /users/update
        const res = await supertest(app)
            .post('/users/update')  // Changed to /users/update
            .send({
                user_firebase_id: 'test_firebase_id',
                name: 'Updated User',
                pronoun: 'he/him',
                email: 'updated@example.com',
                phone_number: '9876543210',
                profile_img_url: 'https://example.com/new-profile.jpg'
            })
            .expect(200);  // Expecting HTTP status 200

        // Assert response data
        expect(res.body).to.have.property('message', 'User updated successfully');
    });

    // Test for 404 when user is not found during update
    it('should return 404 if user not found during update', async () => {
        // Mock the DB response when no user is found to update
        queryStub.resolves([{ affectedRows: 0 }]);

        // Send POST request to /users/update
        const res = await supertest(app)
            .post('/users/update')  // Changed to /users/update
            .send({
                user_firebase_id: 'invalid_firebase_id',
                name: 'Nonexistent User',
                pronoun: 'they/them',
                email: 'nonexistent@example.com',
                phone_number: '0000000000',
                profile_img_url: 'https://example.com/invalid.jpg'
            })
            .expect(404);  // Expecting HTTP status 404

        // Assert response data
        expect(res.body).to.have.property('message', 'User not found');
    });

    // Test for server error during user creation
    it('should return 500 if there is a server error', async () => {
        // Mock a DB error
        queryStub.rejects(new Error('Database error'));

        // Send POST request to /users
        const res = await supertest(app)
            .post('/users')  // Changed to /users
            .send({
                user_firebase_id: 'test_firebase_id',
                name: 'Test User',
                pronoun: 'he/him',
                email: 'test@example.com',
                phone_number: '1234567890',
                profile_img_url: 'https://example.com/profile.jpg'
            })
            .expect(500);  // Expecting HTTP status 500

        // Assert response data
        expect(res.body).to.have.property('message', 'Failed to create user');
    });
});
