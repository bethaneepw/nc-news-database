const db = require ("../../db/connection");
const { commentData } = require("../../db/data/test-data");


exports.selectArticleById = (articleId) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1`, [articleId])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "article not found"})
            } else {
                return rows[0];
            }
        })
 
}

exports.selectArticles = () => {
    return db.query(`SELECT article_id, COUNT(*) AS comment_count 
    FROM comments 
    GROUP BY article_id`).then(({rows}) => {
    const commentCounts = rows
    return db.query(`SELECT * FROM articles ORDER BY created_at DESC`)
        .then(({rows})=> {
            formattedArticles = []
            rows.forEach((article) => {
            delete article.body
            let commentCountToAdd = 0
                commentCounts.forEach((commentCount) => {
                    if (commentCount.article_id === article.article_id){
                        commentCountToAdd += Number(commentCount.comment_count)
                    }          
                })
            formattedArticles.push({...article, comment_count : commentCountToAdd})
            })
        
        return formattedArticles 
    })
    
        
    })
}
