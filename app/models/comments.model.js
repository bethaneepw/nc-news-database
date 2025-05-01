const db = require ("../../db/connection");
const format = require("pg-format")


exports.selectCommentsByArticleId = (articleId, query) => {
    
    const queryValues = [articleId]
    let queryCount = 1;
    let queryStr = `SELECT * FROM comments
        WHERE article_id = $${queryCount} ORDER BY created_at ASC`

    const limit = query.limit ? parseInt(query.limit) : 10
    const page = query.p ? parseInt(query.p) : 1
    const offset = (page - 1) * limit;

    queryValues.push(limit, offset)
    queryStr += ` LIMIT $${++queryCount} OFFSET $${++queryCount}`
    return db.query(queryStr, queryValues)
        .then(({rows}) => {

            if(rows.length === 0 && query.p) {
                return Promise.reject({status: 404, msg: "page not found"})
            }
            return rows;
        })
}

exports.insertCommentByArticleId = (articleId, commentToPost) => {
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

exports.removeCommentById = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [commentId]).then(({rows})=> {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "comment not found"})
        }
    })
}

exports.updateCommentById = (commentId, votesToInc) => {    
    const queryValues = [votesToInc, commentId]
     return db.query(`UPDATE comments
        SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, queryValues)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "comment not found"})
        }
        return rows[0];
    })
}