const db = require ("../../db/connection");
const { checkIfArticleExists } = require("./articles.model")


exports.selectCommentsByArticleID = (articleId) => {
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1 ORDER BY created_at ASC`, [articleId])
        .then(({rows}) => {
            if (rows.length === 0) {
                return checkIfArticleExists(articleId).then((result) => {
                    if (result) {
                        return {msg: `no comments found under article_id ${articleId}`}
                    } else {
                        return Promise.reject({status: 404, msg: "article not found"})
                    }
                })
            }
            return rows;
        })

}