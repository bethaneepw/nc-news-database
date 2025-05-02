const db = require ("../../db/connection")
const format = require("pg-format")


exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows;
    })
}

exports.addTopic = (topicInfo) => {
    const topicInfoArr = [
        [
       topicInfo.slug,
       topicInfo.description,
       topicInfo.img_url
    ]]

    queryStr = format(`INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`, topicInfoArr)

    return db.query(queryStr).then(({rows}) => {
        return rows[0]
    })
}