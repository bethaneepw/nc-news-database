const db = require ("../../db/connection");


function selectCommentCountsOfArticles() {
    return db.query(`SELECT article_id, COUNT(*) AS comment_count 
    FROM comments 
    GROUP BY article_id`)
    .then(({rows})=>{
        return rows;
    })
}

exports.selectArticles = (query) => {
    let queryStr = `SELECT * FROM articles`
    const queryValues = []
    const acceptedSortQueries = ["", "created_at", "topic", "author", "votes"]
    const acceptedOrderQueries = ["ASC", "DESC"]
    
    if (query.topic) {
        queryStr += ` WHERE topic = $1`
        queryValues.push(query.topic)
    }

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
    return selectCommentCountsOfArticles()
    .then((commentCounts) => {
    return db.query(queryStr, queryValues)
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

exports.selectArticleById = (articleId) => {
    return selectCommentCountsOfArticles()
    .then((commentCounts)=> {
        return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1`, [articleId])
    
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "article not found"})
        } else {
            const obj = {...rows[0], comment_count: 0}

            commentCounts.forEach((commentCount)=>{
                if (commentCount.article_id === Number(articleId)) {
                    obj.comment_count += Number(commentCount.comment_count)
                }
            })
            
            return obj;

        }
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


