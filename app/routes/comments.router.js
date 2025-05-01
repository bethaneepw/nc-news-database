const { deleteCommentById, updateCommentById, patchCommentById } = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id")
.delete(deleteCommentById)
.patch(patchCommentById)

module.exports = commentsRouter