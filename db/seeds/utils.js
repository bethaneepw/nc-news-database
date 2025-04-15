const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.convertArticleTitleToArticleID =(articleTitle) => {
  if (!articleTitle) return null;
  const formattedString = articleTitle.replace("'", "''")
  return db.query(`SELECT article_id FROM articles
    WHERE title = ${formattedString}`)
  .then((result)=>{
    console.log(result, "<<<< result of query")
  })
}



