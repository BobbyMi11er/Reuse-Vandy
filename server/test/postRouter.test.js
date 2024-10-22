const { expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../server'); // Adjust path to your server.js
const pool = require('../connection'); // Your MySQL connection

describe('Post Router', () => {
    let queryStub;

    beforeEach(() => {
        queryStub = sinon.stub(pool, 'execute');
    });

    afterEach(() => {
        sinon.restore();
    });

    // Test for creating a new post
    it('should create a new post', async () => {
        queryStub.resolves([{ insertId: 1 }]);

        const res = await supertest(app)
            .post('/posts')
            .send({
                user_firebase_id: 'user_firebase_id_1',
                title: 'New Post Title',
                description: 'Description for the post',
                color: 'blue',
                image_url: 'https://example.com/image.jpg',
                price: 100,
                size: 'medium'
            })
            .expect(201);

        expect(res.body).to.have.property('post_id', 1);
        expect(res.body).to.have.property('message', 'Post created');
    });

    // Test for retrieving all posts with filters
    it('should retrieve all posts with filters', async () => {
        const mockPosts = [
            { post_id: 1, title: 'Post One', description: 'Description One', price: 50, size: 'small' },
            { post_id: 2, title: 'Post Two', description: 'Description Two', price: 100, size: 'large' }
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get('/posts')
            .query({ min_price: 50, max_price: 150 })
            .expect(200);

        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockPosts[0]);
        expect(res.body[1]).to.deep.equal(mockPosts[1]);
    });

    // Test for retrieving a single post by ID
    it('should retrieve a single post by post_id', async () => {
        const mockPost = { post_id: 1, title: 'Post One', description: 'Description One', price: 50, size: 'small' };

        queryStub.resolves([[mockPost]]);

        const res = await supertest(app)
            .get('/posts/1')
            .expect(200);

        expect(res.body).to.deep.equal(mockPost);
    });

    // Test for updating a post
    it('should update a post by post_id', async () => {
        queryStub.resolves([{ affectedRows: 1 }]); // Mock update success

        const res = await supertest(app)
            .put('/posts/1')
            .send({
                title: 'Updated Post',
                description: 'Updated description',
                color: 'red',
                image_url: 'https://example.com/new_image.jpg',
                price: 150,
                size: 'large'
            })
            .expect(200);

        expect(res.body).to.have.property('message', 'Post updated successfully');
    });

    // Test for returning 404 when updating a non-existent post
    it('should return 404 if the post does not exist during update', async () => {
        queryStub.resolves([[]]);  // Mock empty result for no post found

        const res = await supertest(app)
            .put('/posts/999')  // Non-existent post ID
            .send({
                title: 'Non-existent Post',
                description: 'Non-existent description',
                color: 'red',
                image_url: 'https://example.com/non_existent_image.jpg',
                price: 150,
                size: 'large'
            })
            .expect(404);

        // console.log('Update Non-existent Post Response:', res.body); // Debug print
        expect(res.body).to.have.property('message', 'Post not found');
    });

    // Test for deleting a post by post_id
    it('should delete a post by post_id', async () => {
        queryStub.resolves([{ affectedRows: 1 }]); // Mock successful deletion

        const res = await supertest(app)
            .delete('/posts/1')
            .expect(200);

        // console.log('Delete Post Response:', res.body); // Debug print
        expect(res.body).to.have.property('message', 'Post deleted successfully');
    });    
});
