const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed")
const data = require ("../db/data/test-data")
const request = require("supertest")
const app = require ("../app")
const db = require("../db/connection");
const { checkIfArticleExists } = require("../app/models/articles.model");

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
        topic: expect.any(String),
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

describe("GET /api/articles", () => {
  describe("GET /api/articles", () => {
    test("200: Responds with an array of article objects", () => {
          return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({body: { articles }}) => {
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            });
          })
        })
      })

    test("200: Article objects do not contain a body property", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body: { articles }}) => {
        expect(articles).toHaveLength(13)
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body")
        })
      })
    })

    test("200: Response is ordered by date descending order by default", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body : {articles }}) => {
        expect(articles).toBeSortedBy('created_at', { descending: true })
      })
    })
  })
  describe("?sort_by", () => {
    test("200: Accepts a sort_by query, which defaults to the created at data", () => {
        return request(app)
        .get("/api/articles?sort_by")
        .expect(200)
        .then(({body : {articles }}) => {
          expect(articles).toBeSortedBy('created_at', { descending: true })
        })

      })

      test("200: Accepts a sort_by query for created at data", () => {
        return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({body : {articles }}) => {
          expect(articles).toBeSortedBy('created_at', { descending: true })
        })
      })

      test("200: Accepts a sort_by query for topics", () => {
        return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({body : {articles }}) => {
          expect(articles).toBeSortedBy('topic', { descending: true })
        })
      })

      test("200: Accepts a sort_by query for authors", () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body : {articles }}) => {
          expect(articles).toBeSortedBy('author', { descending: true })
        })
      })

      test("200: Accepts a sort_by query for votes", () => {
        return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({body : {articles }}) => {
          expect(articles).toBeSortedBy('votes', { descending: true })
        })
      })
  })
  describe("?order", () => {
    test("200: Accepts an order query which defaults to descending", () => {
    return request(app)
    .get("/api/articles?order")
    .expect(200)
    .then(({body : {articles }}) => {
      expect(articles).toBeSortedBy('created_at', { descending: true })
    })
  })

  test("200: Accepts an order query, which can be set to desc", () => {
    return request(app)
    .get("/api/articles?order=desc")
    .expect(200)
    .then(({body : {articles }}) => {
      expect(articles).toBeSortedBy('created_at', { descending: true })
    })
  })

  test("200: Accepts an order query, which can be set to asc", () => {
    return request(app)
    .get("/api/articles?order=asc")
    .expect(200)
    .then(({body : {articles }}) => {
      expect(articles).toBeSortedBy('created_at')
    })
  })

  test("200: Accepts an order query when given multiple queries", () => {
    return request(app)
    .get("/api/articles?sort_by=author&order=asc")
    .expect(200)
    .then(({body : {articles }}) => {
      expect(articles).toBeSortedBy('author')
    })
  })
  })
  describe.only("?topic", () => {
    test("200: accepts topic query which filters the articles by the topic value specified in the query", () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({body: { articles }}) => {
        expect(articles).toHaveLength(1)
        expect(articles[0]).toMatchObject({
          article_id: expect.any(Number),
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          article_img_url:"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: expect.any(Number)
        })
      })
    })

  test("200: if query is omitted, the endpoint responds with all topics", () => {
    return request(app)
    .get("/api/articles?topic")
    .expect(200)
    .then(({body: { articles }}) => {
        expect(articles).toHaveLength(13)
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
        })
      })
    })

  test("200: returns empty array when topic has no articles", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({body: { articles }}) => {
        expect(articles).toEqual([])
      })
    })
  })

describe("ERRORS", () => {
  test("404: No data found for invalid sort query", () => {
    return request(app)
    .get("/api/articles?sort_by=banana")
    .expect(404)
    .then(({body : { msg }}) => {
      expect(msg).toBe('not found: invalid sort query')
    })
  })

  test("404: No data found for invalid order query", () => {
    return request(app)
    .get("/api/articles?order=banana")
    .expect(404)
    .then(({body : { msg }}) => {
      expect(msg).toBe('not found: invalid order query')
    })
  })

  test("404: No data found for invalid topics query", () => {
    return request(app)
    .get("/api/articles?topics=banana")
    .expect(400)
    .then(({body : { msg }}) => {
      expect(msg).toBe('invalid data')
    })
  })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with all comments for an article", () => {
    return request(app)
    .get("/api/articles/3/comments")
    .expect(200)
    .then(({body : { comments }}) => {
      expect(comments).toHaveLength(2)
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 3
        })
      })
    })
  })

  test("200: Comments are served with the most recent comments first", () => {
     return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body : { comments }}) => {
      expect(comments).toBeSortedBy('created_at')
    })
  })

  test("200: Responds with empty array if there are no comments for a valid article id", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({body : { comments }}) => {
      expect( comments ).toEqual([])
    })
  })

  test("404: Responds with an error message if searching for comments for an article id that doesn't exist", () => {
    return request(app).get("/api/articles/356/comments")
    .expect(404)
    .then(({body: {msg }}) => {
      expect(msg).toBe("article not found")
    })
  })

  test("400: Responds with an error message if searching for comments with an invalid article id", () => {
    return request(app)
    .get("/api/articles/banana/comments")
    .expect(400)
    .then(({body : {msg}}) => {
      expect(msg).toBe("invalid data type for request")
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the added article", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username : "butter_bridge",
      body: "just inserting a little comment!"
    })
    .expect(201)
    .then(({ body : { comment }})=> {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: 0,
        created_at: expect.any(String),
        author: "butter_bridge",
        body: "just inserting a little comment!",
        article_id: 1
      })
    })
  })

  test("400: Responds with bad request if not given data type string", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username : "butter_bridge",
      body: 2577
    })
    .expect(400)
    .then(({ body : { msg }})=> {
      expect(msg).toBe("invalid body")
    })
  })

  test("400: Responds with bad request error when attempting to add comment with invalid username", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username : "bethanypw",
      body: "just inserting a little comment!"
    })
    .expect(400)
    .then(({ body : { msg }})=> {
      expect(msg).toBe("required data not present")
    })
  })

  test("400: Responds with bad request error when attempting to add comment without valid data", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username : "butter_bridge",
    })
    .expect(400)
    .then(({ body : { msg }})=> {
      expect(msg).toBe("invalid body")
    })
  })

  test("400: Responds with bad request error when attempting to add comment without any username", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      body: "this comment has no username",
    })
    .expect(400)
    .then(({ body : { msg }})=> {
      expect(msg).toBe("no username provided")
    })
  })

  test("400: Responds with bad request error when attempting to add comment with username of incorrect data type", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({
      username: 458,
      body: "this comment has invalid username",
    })
    .expect(400)
    .then(({ body : { msg }})=> {
      expect(msg).toBe("required data not present")
    })
  })

  test("400: Responds with bad request when attempting to add comment to an invalid article id", () => {
    return request(app)
    .post("/api/articles/banana/comments")
    .send({
      username : "butter_bridge",
      body: "just inserting a little comment!"
    })
    .expect(400)
    .then(({body : { msg }})=> {
      expect(msg).toBe("invalid data type for request")
    })
  })

  test("400: Responds with request when attempting to add comment to a valid article id not found within table", () => {
    return request(app)
    .post("/api/articles/356/comments")
    .send({
      username : "butter_bridge",
      body: "just inserting a little comment!"
    })
    .expect(400)
    .then(({body: {msg }}) => {
      expect(msg).toBe("required data not present")
    })
  })
})

describe("PATCH:  /api/articles/:article_id", () => {
  test("200: Responds with the updated article", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: 3 })
    .expect(200)
    .then(({ body : {article}})=> {
      expect(article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        author: "butter_bridge",
        topic: "mitch",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 103,
        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    })
  })

  test("200: Responds with the updated article when decrementing votes", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: -40 })
    .expect(200)
    .then(({ body : {article}})=> {
      expect(article).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        author: "butter_bridge",
        topic: "mitch",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 60,
        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    })
  })

  test("400: Responds with PSQL error if request contains invalid data", () => {
    return request(app)
    .patch("/api/articles/1/")
    .send({ inc_votes: "hello!" })
    .expect(400)
    .then(({body : {msg}}) => {
      expect(msg).toBe("invalid data type for request")
    })
  })

  test("400: Responds with PSQL error if article_id contains invalid data", () => {
    return request(app)
    .patch("/api/articles/banana/")
    .send({ inc_votes: 3 })
    .expect(400)
    .then(({body : {msg}}) => {
      expect(msg).toBe("invalid data type for request")
    })
  })

  test("404: Responds with not found if article does not exist under article_id", () => {
    return request(app).patch("/api/articles/356/")
    .send({ inc_votes: 3 })
    .expect(404)
    .then(({body: {msg }}) => {
      expect(msg).toBe("article not found")
    })
  })
})

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: Deletes the given comment by comment_id", () => {
    return request(app)
    .delete("/api/comments/10")
    .expect(204)
  })

  test("400: Responds with bad request if comment_id contains invalid data", () => {
    return request(app)
    .delete("/api/comments/banana")
    .expect(400)
    .then(({body : {msg}}) => {
      expect(msg).toBe("invalid data type for request")
    })
  })

  test("404: Responds with not found if comment_id contains data for comment that does not exist", () => {
    return request(app)
    .delete("/api/comments/356")
    .expect(404)
    .then(({body : {msg }}) => {
      expect(msg).toBe("comment not found")
    })
  })
})

describe("GET: /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body: { users }}) => {
      expect(users).toHaveLength(4)
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
      });
    })
  })
})
})

describe("ERROR invalid endpoint", () => {
  test("404: Responds with error if user inputs an invalid endpoint", () => {
    return request(app)
    .get("/api/topicz")
    .expect(404)
    .then(({body: {msg}}) => {
      expect(msg).toBe("path not found")
    })
  })
})