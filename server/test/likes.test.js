const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path to your server.js
const pool = require("../connection"); // Your MySQL connection

describe("Likes Router", () => {
  let queryStub;

  beforeEach(() => {
    queryStub = sinon.stub(pool, "execute");
  });

  afterEach(() => {
    sinon.restore();
  });

  // Test GET /by-user/:user_firebase_id
  describe("GET /by-user/:user_firebase_id", () => {
    it("should retrieve posts liked by a user", async () => {
      const userFirebaseId = "user_firebase_id_1";
      queryStub.resolves([[{ post_id: 1 }, { post_id: 2 }]]);

      const res = await supertest(app)
        .get(`/likes/by-user/${userFirebaseId}`)
        .expect(200);

      expect(res.body).to.be.an("array").that.deep.equals([
        { post_id: 1 },
        { post_id: 2 },
      ]);
    });

    it("should return 500 if the query fails", async () => {
      queryStub.rejects(new Error("Database error"));

      const res = await supertest(app)
        .get(`/likes/by-user/user_firebase_id_1`)
        .expect(500);

      expect(res.body).to.have.property("message", "Failed to retrieve likes");
    });
  });

  // Test GET /by-post/:post_id
  describe("GET /by-post/:post_id", () => {
    it("should retrieve users who liked a post", async () => {
      const postId = 1;
      queryStub.resolves([[{ user_firebase_id: "user_firebase_id_1" }]]);

      const res = await supertest(app)
        .get(`/likes/by-post/${postId}`)
        .expect(200);

      expect(res.body).to.be.an("array").that.deep.equals([
        { user_firebase_id: "user_firebase_id_1" },
      ]);
    });

    it("should return 500 if the query fails", async () => {
      queryStub.rejects(new Error("Database error"));

      const res = await supertest(app)
        .get(`/likes/by-post/1`)
        .expect(500);

      expect(res.body).to.have.property("message", "Failed to retrieve likes");
    });
  });

  // Test POST /
  describe("POST /", () => {
    it("should add a like", async () => {
      queryStub.resolves([{ insertId: 1 }]);

      const res = await supertest(app)
        .post("/likes")
        .send({
          user_firebase_id: "user_firebase_id_1",
          post_id: 1,
        })
        .expect(201);

      expect(res.body).to.have.property("message", "Like added");
      expect(res.body).to.have.property("post_id", 1);
    });

    it("should return 500 if adding a like fails", async () => {
      queryStub.rejects(new Error("Database error"));

      const res = await supertest(app)
        .post("/likes")
        .send({
          user_firebase_id: "user_firebase_id_1",
          post_id: 1,
        })
        .expect(500);

      expect(res.body).to.have.property("message", "Failed to add like");
    });
  });

  // Test DELETE /
  describe("DELETE /", () => {
    it("should delete a like", async () => {
      queryStub.onFirstCall().resolves([[{ post_id: 1 }]]); // Mock SELECT query
      queryStub.onSecondCall().resolves(); // Mock DELETE query

      const res = await supertest(app)
        .delete("/likes")
        .send({
          user_firebase_id: "user_firebase_id_1",
          post_id: 1,
        })
        .expect(200);

      expect(res.body).to.have.property("message", "Like deleted successfully");
    });

    it("should return 404 if the like does not exist", async () => {
      queryStub.resolves([[]]); // Mock empty SELECT query

      const res = await supertest(app)
        .delete("/likes")
        .send({
          user_firebase_id: "user_firebase_id_1",
          post_id: 1,
        })
        .expect(404);

      expect(res.body).to.have.property("message", "Like not found");
    });

    it("should return 500 if deleting a like fails", async () => {
      queryStub.onFirstCall().resolves([[{ post_id: 1 }]]); // Mock SELECT query
      queryStub.onSecondCall().rejects(new Error("Database error")); // Mock DELETE query error

      const res = await supertest(app)
        .delete("/likes")
        .send({
          user_firebase_id: "user_firebase_id_1",
          post_id: 1,
        })
        .expect(500);

      expect(res.body).to.have.property("message", "Failed to delete like");
    });
  });
});
