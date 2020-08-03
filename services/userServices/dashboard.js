const {
    Client,
    Pool
} = require('pg');
require("dotenv").config();

const pool = new Pool({
    user: process.env.USER_DB,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
    ssl: true

});
// const pool = new Pool({
//     user: 'qfzsmktomwudcl',
//     host: 'ec2-54-236-146-234.compute-1.amazonaws.com',
//     database: 'd1a1nur5lqn037',
//     password: 'd68f2ef498507e4c39c3acfae50c61cf361cfda9e8c5d972ff24a61cf6d54de2',
//     port: 5432,
//     ssl: true

// })

function searchEdit(data, callback) {
    //queries 
    let value;
    let sql = ''
    console.log(data)
    if (data.payloadEmail) {
        sql = `select user_email, phonenumber from users where  user_id= $1 and user_email = $2`
        value = [data.userId, data.payloadEmail]
    } else {
        sql = `select user_email, phonenumber from users where  user_email= $1`
        value = [data.email]
    }

    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err)
        }
        client.query(sql, value, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('user found');
            return callback(null, result.rows[0]);

        })
    })

}

function reset(data,callback) {
    let value = [data.password,data.userId];
    console.log(value);
    let email = data.email;
    let sql = `UPDATE users SET user_password = $1 WHERE user_id = $2`;
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err)
        }
        client.query(sql, value, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('password reset');
            console.log(result.rows[0]);
            return callback(null, result.rows[0]);

        })
    })
}

module.exports = {
    searchEdit,
    reset
}