const express = require("express")
const app = express()
const apiRouter = require("./app/routes/router")
const { customErrorHandler, internalServerError, sqlErrorHandler } = require("./app/controllers/error.controller")

app.use(express.json());

app.use("/api", apiRouter)

app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "path not found"})
})

app.use(sqlErrorHandler)
app.use(customErrorHandler)
app.use(internalServerError)


module.exports = app