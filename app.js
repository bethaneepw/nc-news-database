const express = require("express")
const app = express()
const { getApi } = require("./app/controllers/api.controller")
const { getTopics } = require("./app/controllers/topics.controller")
const { customErrorHandler, internalServerError, sqlErrorHandler } = require("./app/controllers/error.controller")
const { getArticleById } = require("./app/controllers/articles.controller")


app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.use(sqlErrorHandler)
app.use(customErrorHandler)

app.use(internalServerError)


module.exports = app