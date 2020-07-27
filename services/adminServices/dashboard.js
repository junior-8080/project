const {
    Client,
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'project',
    password: 'abdul',
    port: 5432

})



function AllUsers(callback) {

    let sql = `select * from  users where  users.roles = 'user'`
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        client.query(sql, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log(result.rows);
            return callback(null, result.rows);
        })
    })

}

function AllProducts(callback) {

    let sql = `select products.user_id,products.product_id,products.product_name,products.product_price,products.category_name,product_date,users.user_id,users.user_email
     from products inner join users on products.user_id = users.user_id
    where product_id > 2070 order by products.product_id`;

    // let sql = `select products.* from product_image inner join products on product_image.product_id = products.product_id
    //  inner join images on images.image_id = product_image.image_id`

    // let sql = `select products.* from products inner join `
    // let values = [data]    
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err);


        }
        client.query(sql, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            // console.log(result.rows)
            return callback(null, result.rows.reverse());
        })
    })

}


function aProduct(data, callback) {

    let sql = `select * from products inner join product_image  on products.product_id = product_image.product_id 
        inner join images on images.image_id = product_image.image_id  and products.product_id = $1 order by products.product_id`;

    // let sql = `select products.* from product_image inner join products on product_image.product_id = products.product_id
    //  inner join images on images.image_id = product_image.image_id`

    // let sql = `select products.* from products inner join `
    let values = [data]
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
            console.log(result.rows)

            let newProductArray = [];
            let current = null;
            let previousId = null;
            result.rows.forEach(element => {
                element.images = [];
                // console.log("123")
                if (element.product_id != previousId) {
                    if (current != null) {
                        element.images.push(element.image_path);
                        delete element.image_path;
                        newProductArray.push(element);
                        previousId = element.product_id;
                    } else {
                        current = element;
                        current.images.push(current.image_path);
                        delete current.image_path;
                        newProductArray.push(current);
                        previousId = element.product_id;
                    }
                } else {
                    element.images.push(element.image_path);

                    newProductArray.map(el => {
                        if (el.product_id == element.product_id) {
                            el.images.push(element.image_path)
                        }
                    })
                }
            });
            console.log(newProductArray)
            console.log('products fetched');
            return callback(null, newProductArray[0]);
        })
    })

}


function orders(callback) {
    let sql = `select *  from orders`;
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err)
        }
        client.query(sql, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('fetched');
            return callback(null, result.rows.reverse());

        })
    })

}

function delProduct(data,callback) {
    let sql = `DELETE FROM products WHERE  product_id = $1`;
    console.log(data);
    let values = [data]
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err)
        }
        client.query(sql,values, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('fetched');
            console.log(result.rows);
            return callback(null, result.rows);

        })
    })

}


function delOrders(data,callback) {
    let sql = `DELETE FROM orders WHERE  product_id = $1`;
    let values = [data]
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err)
        }
        client.query(sql,values, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('fetched');
            console.log(result.rows);
            return callback(null, result.rows);

        })
    })

}

function delProduct_image(data,callback) {
    let sql = `DELETE  FROM product_image WHERE  product_id = $1`;
    let values = [data]
    pool.connect((err, client, release) => {
        if (err) {
            console.log(err);
            return callback(err)
        }
        client.query(sql,values, (err, result) => {
            release();
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('fetched');
            console.log(result.rows);
            return callback(null, result.rows);

        })
    })

}




module.exports = {
    AllUsers,
    AllProducts,
    aProduct,
    orders,
    delProduct,
    delProduct_image,
    delOrders
}