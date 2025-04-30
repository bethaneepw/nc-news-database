const db = require ("../../db/connection");


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

exports.selectArticles = (query) => {
    let queryStr = `SELECT * FROM articles`
    const queryValues = []
    const acceptedSortQueries = ["", "created_at", "topic", "author", "votes"]
    const acceptedOrderQueries = ["ASC", "DESC"]
    
    if (query.sort_by) {
        if (!acceptedSortQueries.includes(query.sort_by)) {
        return Promise.reject({ status: 404, msg: "not found: invalid sort query"})
    };
        if (query.sort_by === "") {
            query.sort_by = "created_at"
        }
        queryStr += ` ORDER BY ${query.sort_by}`
    } else {
        queryStr += ` ORDER BY created_at`
    }
    
    if (query.order) {
        if (!acceptedOrderQueries.includes(query.order.toUpperCase())) {
            return Promise.reject({ status: 404, msg: "not found: invalid order query"})
        }
        
        if (query.order.toUpperCase() === `ASC`) {
            queryStr += ` ASC`
        } else {
            queryStr += ` DESC`
        }
    } else queryStr += ` DESC`

    return db.query(`SELECT article_id, COUNT(*) AS comment_count 
    FROM comments 
    GROUP BY article_id`).then(({rows}) => {

    const commentCounts = rows
    return db.query(queryStr)
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

exports.updateArticleById = (articleId, votesToInc) => {
    if (votesToInc === undefined) {
        return Promise.reject({status: 404, msg: "article not found"})
    }
    
    const queryValues = [votesToInc, articleId]
           
     return db.query(`UPDATE articles
        SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, queryValues)
    .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "article not found"})
            } else {
                return rows[0];
            }
    })
}

