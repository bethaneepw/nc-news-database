const { selectArticleById, selectArticles, updateArticleById, addArticle } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    return selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
   const query = req.query
    return selectArticles(query)
    .then(({articles, total_count}) => {
        res.status(200).send({ articles, total_count })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    const votesToInc = req.body.inc_votes
     
    return updateArticleById(articleId, votesToInc)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postArticle = (req, res, next) => {
    const articleInfo = req.body
    return addArticle(articleInfo)
    .then((article) => {
        res.status(201).send({ article })
    })
    
}