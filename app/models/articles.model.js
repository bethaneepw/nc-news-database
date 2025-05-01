const db = require ("../../db/connection");
const format = require("pg-format")


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
    let queryCount = 0
    let whereValues = []    
    
    let countQueryStr = `SELECT COUNT(*) FROM articles`

    if (query.topic) {
        queryStr += ` WHERE topic = $${++queryCount}`
        queryValues.push(query.topic)
        countQueryStr += ` WHERE topic = $${queryCount}`
        whereValues.push(query.topic)
    }

    if (query.sort_by) {
        if (!acceptedSortQueries.includes(query.sort_by)) {
        return Promise.reject({ status: 400, msg: "bad request: invalid sort query"})
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
            return Promise.reject({ status: 400, msg: "bad request: invalid order query"})
        }
        
        if (query.order.toUpperCase() === `ASC`) {
            queryStr += ` ASC`
        } else {
            queryStr += ` DESC`
        }
    } else queryStr += ` DESC`

    // pagination
    const limit = query.limit ? parseInt(query.limit) : 10
    const page = query.p ? parseInt(query.p) : 1;

    const offset = (page - 1) * limit;
    queryValues.push(limit, offset);
    queryStr += ` LIMIT $${++queryCount} OFFSET $${++queryCount}`;

    return Promise.all([selectCommentCountsOfArticles(),
    db.query(queryStr, queryValues),
    db.query(countQueryStr, whereValues)])
    .then(([commentCounts, articlesResult, totalCountResult]) => {

        if(articlesResult.rows.length === 0 && whereValues.length === 0) {
            return Promise.reject({status: 404, msg: "page not found"})
        }

        formattedArticles = []

        articlesResult.rows.forEach((article) => {
            delete article.body
            let commentCountToAdd = 0
                commentCounts.forEach((commentCount) => {
                    if (commentCount.article_id === article.article_id){
                        commentCountToAdd += Number(commentCount.comment_count)
                    }          
                })
            formattedArticles.push({...article, comment_count : commentCountToAdd})
            })

        return {articles : formattedArticles, total_count: Number(totalCountResult.rows[0].count)}

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

exports.addArticle = (articleInfo) => {
const articleInfoArr = [
    [
    articleInfo.author,
    articleInfo.body,
    articleInfo.title,
    articleInfo.topic,
]]

queryStr = format(`INSERT INTO articles (author, body, title, topic) VALUES %L RETURNING *;`, articleInfoArr)
    return db.query(queryStr).then(({rows}) => {
        const obj = {...rows[0], comment_count: 0}
        return obj;
    })
}


