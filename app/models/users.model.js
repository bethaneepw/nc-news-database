const db = require("../../db/connection")


exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        return rows;
    })
}

exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username]).then(({rows})=>{
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg : "user not found"})
        }
        return rows[0]
    })
}