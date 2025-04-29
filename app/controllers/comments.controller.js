const { selectArticleById } = require("../models/articles.model")
const { selectCommentsByArticleID, insertCommentByArticleID } = require ("../models/comments.model")


exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    return selectArticleById(articleId).then(()=>{
    return selectCommentsByArticleID(articleId).then((comments) => {
        if (comments.msg) {
            res.status(200).send({ msg : comments.msg })
        } else {
            res.status(200).send({ comments })
        }
        
    }).catch((err) => {
        next(err)
    })
})
}

exports.postCommentByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    const commentToPost = req.body
    return insertCommentByArticleID(articleId, commentToPost).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
       next (err)
    })

}