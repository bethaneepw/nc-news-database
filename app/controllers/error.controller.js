exports.sqlErrorHandler = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg : `invalid data type for request`})
    } else if (err.code === "23503") {
        res.status(400).send({ msg: `required data not provided`})
    } else {
        next(err)
    }
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg})
    } else {
        next(err)
    }
}

exports.internalServerError = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: "internal server error"})
}