const { expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../server'); // Adjust path to your server.js
const pool = require('../connection'); // Your MySQL connection

describe('User Router', () => {
    let queryStub;

    beforeEach(() => {
        queryStub = sinon.stub(pool, 'execute');
    });

    afterEach(() => {
        sinon.restore();
    });

    // Test for retrieving all users
    it('should retrieve all users', async () => {
        const mockUsers = [
            { user_firebase_id: 'user_1', name: 'User One', pronouns: 'he/him', email: 'user1@example.com', phone_number: '1234567890', profile_img_url: 'https://example.com/user1.jpg' },
            { user_firebase_id: 'user_2', name: 'User Two', pronouns: 'she/her', email: 'user2@example.com', phone_number: '9876543210', profile_img_url: 'https://example.com/user2.jpg' }
        ];

        queryStub.resolves([mockUsers]);

        const res = await supertest(app)
            .get('/users')
            .expect(200);

        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockUsers[0]);
        expect(res.body[1]).to.deep.equal(mockUsers[1]);
    });

    // Test for creating a new user
    it('should create a new user', async () => {
        queryStub.resolves([{ insertId: 1 }]);

        const res = await supertest(app)
            .post('/users')
            .send({
                user_firebase_id: 'test_firebase_id',
                name: 'Test User',
                pronouns: 'they/them',
                email: 'test@example.com',
                phone_number: '1234567890',
                profile_img_url: 'https://example.com/profile.jpg'
            })
            .expect(201);

        expect(res.body).to.have.property('user_firebase_id', 1);
        expect(res.body).to.have.property('message', 'User inserted with ID:');
    });

    // Test for updating a user
    it('should update a user', async () => {
        queryStub.resolves([{ affectedRows: 1 }]);

        const res = await supertest(app)
            .post('/users/update')
            .send({
                user_firebase_id: 'test_firebase_id',
                name: 'Updated User',
                pronouns: 'they/them',
                email: 'updated@example.com',
                phone_number: '9876543210',
                profile_img_url: 'https://example.com/updated-profile.jpg'
            })
            .expect(201);

        expect(res.body).to.have.property('message', 'User inserted with ID:');
    });

    // Test for retrieving a user by ID
    it('should retrieve a user by user_firebase_id', async () => {
        const mockUser = {
            user_firebase_id: 'test_firebase_id',
            name: 'Test User',
            pronouns: 'they/them',
            email: 'test@example.com',
            phone_number: '1234567890',
            profile_img_url: 'https://example.com/profile.jpg'
        };

        queryStub.resolves([[mockUser]]);

        const res = await supertest(app)
            .get('/users/test_firebase_id')
            .expect(200);

        expect(res.body).to.deep.equal(mockUser);
    });

    // Test for returning 404 if the user is not found
    it('should return 404 if user is not found', async () => {
        queryStub.resolves([[]]);  // No user found

        const res = await supertest(app)
            .get('/users/non_existent_id')
            .expect(404);

        expect(res.body).to.have.property('message', 'User not found');
    });

    // Test for deleting a user by user_firebase_id
    it('should delete a user by user_firebase_id', async () => {
        queryStub.resolves([{ affectedRows: 1 }]); // Mock successful deletion

        const res = await supertest(app)
            .delete('/users/test_firebase_id')
            .expect(200);

        expect(res.body).to.have.property('message', 'User deleted successfully');
    });
});
