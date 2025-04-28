

exports.internalServerError = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: "internal server error"})
}