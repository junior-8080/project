const {
    Client,
    Pool
} = require('pg');

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'project',
//     password: 'abdul',
//     port: 5432

// })

require("dotenv").config()
const pool = new Pool({
    user: 'qfzsmktomwudcl',
    host: 'ec2-54-236-146-234.compute-1.amazonaws.com',
    database: 'd1a1nur5lqn037',
    password: 'd68f2ef498507e4c39c3acfae50c61cf361cfda9e8c5d972ff24a61cf6d54de2',
    port: 5432,
   ssl: true

})

function createUser(data, callback) {
    let sql = 'insert into users(user_email,user_password,phonenumber,roles) values($1,$2,$3,$4)';
    let values = [data.email, data.password,data.phonenumber,data.roles]
    // let values = [data.email, data.password]
      console.log(values);
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err);


        }
        client.query(sql, values, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('Data is saved');
            return callback(null, result.rows[0]);
        })
    })


}

function fetchUser(data, callback) {
    //queries 
    console.log(pool)
    let value = [data];
    // console.log(value);
    let sql = `select * from users where user_id = $1`;
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
            console.log('user fetched successfully');
            console.log(result.rows[0]);
            return callback(null, result.rows[0]);

        })
    })

}

function searchUser(data, callback) {
    //queries 
    let value = [data];
    // console.log(value);
    let sql = `select * from users where user_email= $1`;
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
            console.log(result.rows[0]);
            return callback(null, result.rows[0]);

        })
    })

}

function phoneNumber(data, callback) {
    //queries 
    let value = [data];
    // console.log(value);
    let sql = `select phonenumber from users where phonenumber = $1`;
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
            console.log('number found');
            console.log(result.rows[0]);
            return callback(null, result.rows[0]);

        })
    })

}

function editUser(data,callback){
    let value = [data.email,data.phonenumber,data.userId];
    console.log(value);
    let email = data.email;
    let sql = `UPDATE users SET (user_email,phonenumber) = ($1,$2) WHERE user_id = $3`;
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
            console.log('user updated successfully');
            console.log(result.rows[0]);
            return callback(null, result.rows[0]);

        })
    })
}

function saveMessage(data, callback) {
    //queries 

}

function saveDeliveryReport(data, callback) {
    //queries 

}

function fetchDeliveryReport(data, callback) {
    //queries 

}

module.exports = {
    createUser,
    fetchUser,
    saveDeliveryReport,
    fetchDeliveryReport,
    searchUser,
    editUser,
    phoneNumber
}