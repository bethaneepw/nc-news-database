const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed")
const data = require ("../db/data/test-data")
const request = require("supertest")
const app = require ("../app")
const db = require("../db/connection")
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data)
})

afterAll (() => {
  return db.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with all topics, with all topics containing correct properties", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: { topics }}) => {
      expect(topics).toHaveLength(3)
      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        })
      });
    })
  })

  test("404: Responds with error if user does not input address correctly", () => {
    return request(app)
    .get("/api/topicz")
    .expect(404)
  })

})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article", () => {
    return request(app)
    .get("/api/articles/4")
    .expect(200)
    .then(({body : { article }}) => {
      expect(article).toMatchObject({
        article_id: 4,
        title: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })

  test("400: Responds with an error when user has given an invalid data type for article id", () => {
    return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({body : {msg}}) => {
      expect(msg).toBe("invalid data type for request")
    })
  })

  test("404: Responds with a valid data type, but no article exists under that id", () => {
    return request(app).get("/api/articles/356")
    .expect(404)
    .then(({body: {msg }}) => {
      expect(msg).toBe("article not found")
    })
  })
})