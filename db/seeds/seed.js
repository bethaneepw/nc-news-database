const db = require("../connection");
const format = require('pg-format');
const {convertTimestampToDate, 
  createRef} = require("./utils.js")

const seed = ({ topicData, userData, articleData, commentData }) => {
  //drop databases
  return db.query('DROP TABLE IF EXISTS comments;')
  .then(() => {
    return db.query('DROP TABLE IF EXISTS articles')
  .then(()=> {
    return db.query('DROP TABLE IF EXISTS users')
    })
  .then(()=> {
    return db.query('DROP TABLE IF EXISTS topics')
  })
  //create databases
  .then(()=> {
    return db.query(`CREATE TABLE topics ( 
      description VARCHAR(100),
      slug VARCHAR(40) PRIMARY KEY,
      img_url VARCHAR(1000));`)
  })
  .then(()=> {
    return db.query(`CREATE TABLE users (
      username VARCHAR(30) PRIMARY KEY ,
      name VARCHAR (80),
      avatar_url VARCHAR(1000))`)
  })
  .then(()=> {
    return db.query(`CREATE TABLE articles (
      article_ID SERIAL PRIMARY KEY, 
      title VARCHAR(100), 
      topic VARCHAR(40) REFERENCES topics(slug), 
      author VARCHAR(30) REFERENCES users(username) ,
      body TEXT, 
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) 
      )`)
  })
  .then(()=> {
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_ID),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(30) REFERENCES users(username),
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )`)
  })
  // Inserting data
  .then (()=>{
    const formattedTopics = topicData.map((topic) => {
      return [topic.description, topic.slug, topic.img_url]
    })
    const insertTopicsQuery = format(`INSERT INTO topics(description, slug, img_url) VALUES %L`, formattedTopics);
    return db.query(insertTopicsQuery)
  })
  .then(()=>{
    const formattedUsers = userData.map((user)=>{
      return [user.username, user.name, user.avatar_url]
    })
    const insertUsersQuery = format(`INSERT INTO users(username, name, avatar_url) VALUES %L`, formattedUsers);
  return db.query(insertUsersQuery)
  })
  .then(()=>{
     const formattedArticles = articleData.map((article) => {
        const formattedDate = convertTimestampToDate(article.created_at)
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          formattedDate.created_at,
          article.votes,
          article.article_img_url
          ]
  })
  const insertArticlesQuery = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`, formattedArticles)
  return db.query(insertArticlesQuery)
  })
.then((result)=>{
  const articlesRefObject = createRef(result.rows)
  const formattedComments = commentData.map((comment)=>{
    const formattedDate = convertTimestampToDate(comment.created_at)
    return [
      articlesRefObject[comment.article_title],
      comment.body,
      comment.votes,
      comment.author,
      formattedDate.created_at
    ]
  })

  const insertCommentsQuery = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`, formattedComments)
  return db.query(insertCommentsQuery)
})
  })
  .catch((err)=> {
    console.log(err)
  }); 
};
module.exports = seed;
