const express = require("express")
const app = express()
const { getApi } = require("./app/controllers/api.controller")
const { getTopics } = require("./app/controllers/topics.controller")
const { internalServerError } = require("./app/controllers/error.controller")


app.get("/api", getApi)

app.get("/api/topics", getTopics)



app.use(internalServerError)


module.exports = app