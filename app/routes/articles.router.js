const { getArticles, getArticleById, patchArticleById } = require("../controllers/articles.controller");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles)

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)

articlesRouter.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentByArticleId)


module.exports = articlesRouter;
