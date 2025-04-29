const express = require("express")
const app = express()
const { getApi } = require("./app/controllers/api.controller")
const { customErrorHandler, internalServerError, sqlErrorHandler } = require("./app/controllers/error.controller")
const { getTopics } = require("./app/controllers/topics.controller")
const { getArticleById, getArticles, patchArticleById } = require("./app/controllers/articles.controller")
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require ("./app/controllers/comments.controller")

app.use(express.json());

app.get("/api", getApi)
app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "path not found"})
})

app.use(sqlErrorHandler)
app.use(customErrorHandler)
app.use(internalServerError)


module.exports = app