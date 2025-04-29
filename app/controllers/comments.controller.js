const { selectCommentsByArticleID } = require ("../models/comments.model")

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    return selectCommentsByArticleID(articleId).then((comments) => {
        
        if (comments.msg) {
            res.status(200).send({ msg : comments.msg })
        } else {
            res.status(200).send({ comments })
        }
        
    }).catch((err) => {
        next(err)
    })
}