const e = require("express");
const db = require ("../../db/connection");
const { checkIfArticleExists } = require("./articles.model")
const format = require("pg-format")


exports.selectCommentsByArticleID = (articleId) => {
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1 ORDER BY created_at ASC`, [articleId])
        .then(({rows}) => {

            return rows;
        })
}

exports.insertCommentByArticleID = (articleId, commentToPost) => {
    if (commentToPost.body === undefined || typeof commentToPost.body !== "string") {
        return Promise.reject({status: 400, msg: "invalid body"})
    }
    if (commentToPost.username === undefined) {
        return Promise.reject({status: 400, msg : "no username provided"})
    }

    const formattedInsert = [
    [
        Number(articleId),
        commentToPost.body,
        commentToPost.username
    ]
    ]
    queryStr = format(`INSERT INTO comments (article_id, body, author) VALUES %L RETURNING *;`, formattedInsert)
    return db.query(queryStr).then(({rows}) => {
        return rows[0];
 })
}