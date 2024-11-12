const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");
const app = require("../server"); // Adjust path to your server.js
const pool = require("../connection"); // Your MySQL connection
const { upload } = require("../middleware/fileUpload");

describe("Post Router", () => {
    let queryStub;

    beforeEach(() => {
        queryStub = sinon.stub(pool, "execute");
    });

    afterEach(() => {
        sinon.restore();
    });

    // Test for creating a new post
    it("should create a new post", async () => {
        queryStub.resolves([{ insertId: 1 }]);

        const res = await supertest(app)
            .post("/posts")
            .send({
                user_firebase_id: "user_firebase_id_1",
                title: "New Post Title",
                description: "Description for the post",
                color: "blue",
                image_url: "https://example.com/image.jpg",
                price: 100,
                size: "medium",
            })
            .expect(201);

        expect(res.body).to.have.property("post_id", 1);
        expect(res.body).to.have.property("message", "Post created");
    });

    // Test for failed post creation
    it("should return 500 if post creation fails", async () => {
        queryStub.rejects(new Error("Database error"));

        const res = await supertest(app)
            .post("/posts")
            .send({
                user_firebase_id: "user_firebase_id_1",
                title: "New Post Title",
                description: "Description for the post",
                color: "blue",
                image_url: "https://example.com/image.jpg",
                price: 100,
                size: "medium",
            })
            .expect(500);

        expect(res.body).to.have.property("message", "Failed to create post");
    });

    // Test for retrieving all posts with filters
    it("should retrieve all posts with filters", async () => {
        const mockPosts = [
            {
                post_id: 1,
                title: "Post One",
                description: "Description One",
                price: 50,
                size: "small",
            },
            {
                post_id: 2,
                title: "Post Two",
                description: "Description Two",
                price: 100,
                size: "large",
            },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts")
            .query({ min_price: 50, max_price: 150 })
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockPosts[0]);
        expect(res.body[1]).to.deep.equal(mockPosts[1]);
    });

    // Test for failed retrieval of all posts
    it("should return 500 if retrieving all posts fails", async () => {
        queryStub.rejects(new Error("Database error"));

        const res = await supertest(app).get("/posts").expect(500);

        expect(res.body).to.have.property(
            "message",
            "Failed to retrieve posts"
        );
    });

    // Test for retrieving a single post by ID
    it("should retrieve a single post by post_id", async () => {
        const mockPost = {
            post_id: 1,
            title: "Post One",
            description: "Description One",
            price: 50,
            size: "small",
        };

        queryStub.resolves([[mockPost]]);

        const res = await supertest(app).get("/posts/1").expect(200);

        expect(res.body).to.deep.equal(mockPost);
    });

    // Test for retrieving a non-existent post by ID
    it("should return 404 if the post does not exist", async () => {
        queryStub.resolves([[]]);

        const res = await supertest(app).get("/posts/999").expect(404);

        expect(res.body).to.have.property("message", "Post not found");
    });

    // Test for retrieving posts by a user
    it("should retrieve posts by user_firebase_id", async () => {
        const mockPosts = [
            { post_id: 1, title: "Post One", description: "Description One" },
            { post_id: 2, title: "Post Two", description: "Description Two" },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts/user/user_firebase_id_1")
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockPosts[0]);
        expect(res.body[1]).to.deep.equal(mockPosts[1]);
    });

    // Test for updating a post
    it("should update a post by post_id", async () => {
        queryStub.resolves([{ affectedRows: 1 }]); // Mock update success

        const res = await supertest(app)
            .put("/posts/1")
            .send({
                title: "Updated Post",
                description: "Updated description",
                color: "red",
                image_url: "https://example.com/new_image.jpg",
                price: 150,
                size: "large",
            })
            .expect(200);

        expect(res.body).to.have.property(
            "message",
            "Post updated successfully"
        );
    });

    // Test for returning 404 when updating a non-existent post
    it("should return 404 if the post does not exist during update", async () => {
        queryStub.resolves([[]]);

        const res = await supertest(app)
            .put("/posts/999") // Non-existent post ID
            .send({
                title: "Non-existent Post",
                description: "Non-existent description",
                color: "red",
                image_url: "https://example.com/non_existent_image.jpg",
                price: 150,
                size: "large",
            })
            .expect(404);

        expect(res.body).to.have.property("message", "Post not found");
    });

    // Test for deleting a post by post_id
    it("should delete a post by post_id", async () => {
        queryStub.resolves([{ affectedRows: 1 }]); // Mock successful deletion

        const res = await supertest(app).delete("/posts/1").expect(200);

        expect(res.body).to.have.property(
            "message",
            "Post deleted successfully"
        );
    });

    // Test for returning 404 when deleting a non-existent post
    it("should return 404 if the post does not exist during deletion", async () => {
        queryStub.resolves([[]]);

        const res = await supertest(app)
            .delete("/posts/999") // Non-existent post ID
            .expect(404);

        expect(res.body).to.have.property("message", "Post not found");
    });

    // Test for file upload route
    it("should return 403 if no file is uploaded", async () => {
        const res = await supertest(app).post("/posts/fileUpload").expect(403);

        expect(res.body).to.have.property("error", "Please upload a file");
    });

    // Test for retrieving posts with the search filter
    it("should retrieve posts filtered by search term", async () => {
        const mockPosts = [
            {
                post_id: 1,
                title: "Search Post One",
                description: "Description One",
                price: 50,
                size: "small",
            },
            {
                post_id: 2,
                title: "Search Post Two",
                description: "Description Two",
                price: 100,
                size: "large",
            },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts")
            .query({ search: "Search" }) // Pass the search parameter
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockPosts[0]);
        expect(res.body[1]).to.deep.equal(mockPosts[1]);
    });

    // Test for retrieving posts filtered by color
    it("should retrieve posts filtered by color", async () => {
        const mockPosts = [
            {
                post_id: 1,
                title: "Red Post One",
                description: "Description One",
                color: "red",
                price: 50,
                size: "small",
            },
            {
                post_id: 2,
                title: "Red Post Two",
                description: "Description Two",
                color: "red",
                price: 100,
                size: "large",
            },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts")
            .query({ color: "red" }) // Pass the color parameter
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockPosts[0]);
        expect(res.body[1]).to.deep.equal(mockPosts[1]);
    });

    // Test for retrieving posts filtered by user_firebase_id
    it("should retrieve posts filtered by user_firebase_id", async () => {
        const mockPosts = [
            {
                post_id: 1,
                title: "User Post One",
                description: "Description One",
                user_firebase_id: "user_1",
                price: 50,
                size: "small",
            },
            {
                post_id: 2,
                title: "User Post Two",
                description: "Description Two",
                user_firebase_id: "user_1",
                price: 100,
                size: "large",
            },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts")
            .query({ user_firebase_id: "user_1" }) // Pass the user_firebase_id parameter
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockPosts[0]);
        expect(res.body[1]).to.deep.equal(mockPosts[1]);
    });

    // Test for retrieving posts filtered by size
    it("should retrieve posts filtered by size", async () => {
        const mockPosts = [
            {
                post_id: 1,
                title: "Small Post One",
                description: "Description One",
                size: "small",
                price: 50,
            },
            {
                post_id: 2,
                title: "Small Post Two",
                description: "Description Two",
                size: "small",
                price: 100,
            },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts")
            .query({ size: "small" }) // Pass the size parameter
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.deep.equal(mockPosts[0]);
        expect(res.body[1]).to.deep.equal(mockPosts[1]);
    });

    // Test for retrieving posts sorted by price in ascending order
    it("should retrieve posts sorted by price in ascending order", async () => {
        const mockPosts = [
            {
                post_id: 1,
                title: "Post One",
                description: "Description One",
                price: 50,
            },
            {
                post_id: 2,
                title: "Post Two",
                description: "Description Two",
                price: 100,
            },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts")
            .query({ sort_price: "asc" }) // Pass the sort_price parameter
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0].price).to.be.at.most(res.body[1].price); // Verify ascending order
    });

    // Test for retrieving posts sorted by price in descending order
    it("should retrieve posts sorted by price in descending order", async () => {
        const mockPosts = [
            {
                post_id: 1,
                title: "Post Two",
                description: "Description Two",
                price: 100,
            },
            {
                post_id: 2,
                title: "Post One",
                description: "Description One",
                price: 50,
            },
        ];

        queryStub.resolves([mockPosts]);

        const res = await supertest(app)
            .get("/posts")
            .query({ sort_price: "desc" }) // Pass the sort_price parameter
            .expect(200);

        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0].price).to.be.at.least(res.body[1].price); // Verify descending order
    });

    // Test for failed retrieval of a single post due to database error
    it("should return 500 if there is an error retrieving the post", async () => {
        // Simulate a database error
        queryStub.rejects(new Error("Database error"));

        const res = await supertest(app)
            .get("/posts/1") // Attempt to retrieve a post by ID
            .expect(500);

        expect(res.body).to.have.property("message", "Failed to retrieve post");
        expect(res.body).to.have.property("error");
    });

    // Test for failed retrieval of posts by user_firebase_id due to database error
    it("should return 500 if there is an error retrieving posts by user_firebase_id", async () => {
        // Simulate a database error
        queryStub.rejects(new Error("Database error"));

        const res = await supertest(app)
            .get("/posts/user/user_firebase_id_1") // Attempt to retrieve posts by user ID
            .expect(500);

        expect(res.body).to.have.property(
            "message",
            "Failed to retrieve posts"
        );
        expect(res.body).to.have.property("error");
    });

    // Test for failed post update due to database error
    it("should return 500 if there is an error updating the post", async () => {
        // Simulate a database error
        queryStub.onFirstCall().resolves([[{ post_id: 1 }]]); // Mock post exists check
        queryStub.onSecondCall().rejects(new Error("Database error")); // Simulate error on update

        const res = await supertest(app)
            .put("/posts/1")
            .send({
                title: "Updated Post",
                description: "Updated description",
                color: "red",
                image_url: "https://example.com/new_image.jpg",
                price: 150,
                size: "large",
            })
            .expect(500);

        expect(res.body).to.have.property("message", "Failed to update post");
        expect(res.body).to.have.property("error");
    });

    // Test for failed post deletion due to database error
    it("should return 500 if there is an error deleting the post", async () => {
        // Simulate a database error
        queryStub.onFirstCall().resolves([[{ post_id: 1 }]]); // Mock post exists check
        queryStub.onSecondCall().rejects(new Error("Database error")); // Simulate error on delete

        const res = await supertest(app)
            .delete("/posts/1") // Attempt to delete the post by ID
            .expect(500);

        expect(res.body).to.have.property("message", "Failed to delete post");
        expect(res.body).to.have.property("error");
    });
});
