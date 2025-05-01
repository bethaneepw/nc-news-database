const { selectArticleById } = require("../models/articles.model")
const { selectCommentsByArticleId, insertCommentByArticleId, removeCommentById, updateCommentById } = require ("../models/comments.model")


exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    return selectArticleById(articleId).then(()=>{
    return selectCommentsByArticleId(articleId).then((comments) => {
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
    return insertCommentByArticleId(articleId, commentToPost).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
       next (err)
    })

}

exports.deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id
    return removeCommentById(commentId).then(()=> {
        res.status(204).send();
    })
    .catch((err)=> {
        next(err)
    })
}

exports.patchCommentById = (req, res, next) => {
    const commentId = req.params.comment_id
    const votesToInc = req.body.inc_votes
    return updateCommentById(commentId, votesToInc).then((comment) => {
        res.status(200).send({ comment })
    })
}