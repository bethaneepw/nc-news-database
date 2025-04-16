const db = require("./connection");

// Get all of the users
return db.query(`
    SELECT * FROM users;`)
.then((result)=>{
 //   console.log(result.rows, "<-- users")
    return db.query(`
        SELECT * FROM articles
        WHERE topic = 'coding'`)
}).then((result)=> {
    console.log(result.rows, "<--- articles with topic 'coding'")
    return db.query(`
        SELECT * FROM COMMENTS
        WHERE votes < 0;`)
}).then((result)=>{
    console.log(result.rows, "<--- comments where votes are less than zero")
    return db.query(`
        SELECT * FROM topics`)
}).then((result) => {
   console.log(result.rows, "<---- topics")
    return db.query(`
        SELECT * FROM articles
        WHERE author = 'grumpy19'`)
}).then((result)=>{
    console.log(result.rows), "<--- articles by user 'grumpy19'"
    return db.query(`
        SELECT * from comments
        WHERE votes > 10`)
}).then((result) => {
    console.log(result.rows, "<--- comments that have more than 10 votes")
})
.catch((error)=>{
    console.log(error)
})

