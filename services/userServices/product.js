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

const pool = new Pool({
    user: process.env.USER_DB,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
    ssl: true

});
function fetchProducts(callback) {

    let sql = `select * from products inner join product_image  on products.product_id = product_image.product_id 
    inner join images on images.image_id = product_image.image_id   order by products.product_id`;

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

            let newProductArray = [];
            let current = null;
            let previousId = null;
            result.rows.forEach(element => {
                element.images = [];
                // console.log("123")
                element.product_price = element.product_price.replace('$', '');
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
            return callback(null, newProductArray);
        })
    })

}

function fetchProductByCat(data, callback) {
    let sql = `select * from products inner join product_image  on products.product_id = product_image.product_id 
    inner join images on images.image_id = product_image.image_id where products.category_name = $1  order by products.product_id `;
    let values = [data.category]
    console.log(values)
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
                element.product_price = element.product_price.replace('$', '');
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
            return callback(null, newProductArray);
        })
    })


}

function savePath(data, callback) {
    // console.log(data)
    let sql = 'insert into images(image_name,image_path) values($1,$2) returning image_id';
    let values = [data.name, data.path]
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
            // console.log(result.rows)
            return callback(null, result.rows[0]);
        })
    })


}

function saveRequest(data, callback) {
    console.log(data)
    let sql = 'insert into products(user_id,product_name,brand,product_price,product_status,category_name,description,product_ordered) values($1,$2,$3,$4,$5,$6,$7,$8)returning product_id';
    let values = [data.userId, data.name, data.brand, data.price, data.status, data.category, data.description,'0']
    console.log('data')
    console.log(values)
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
            // console.log(result.rows)
            return callback(null, result.rows[0]);
        })
    })


}


function saveProduct_image(data, callback) {
    let sql = 'insert into product_image(product_id,image_id) values($1,$2)';
    let values = [data.product_id, data.image_id]
    console.log('data')
    console.log(values)
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
            // console.log(result.rows)
            return callback(null, result.rows);
        })
    })


}


function createSerialNumber(data, callback) {
    let d1 = new Date();
    data.d1 = d1;
    let sql = 'insert into orders(product_id,serial_number,Serial_Time) values($1,$2,$3) returning product_id';
    let values = [data.product_id, data.serialNumber, data.d1]
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


function editProducStatus(data, callback) {
    let d1 = new Date()
    let value ="";
    let sql ="";
    if (data.key) {
        value=[data.id]
        sql = `UPDATE products SET product_ordered='0' WHERE product_id = $1`;
    } else {
        value = [data.id, d1];
        sql = `UPDATE products SET (product_ordered,orderd_data) = ('1',$2) WHERE product_id = $1`;
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
            console.log('user updated successfully');
            console.log(result.rows[0]);
            return callback(null, result.rows[0]);

        })
    })
}

function productInspection(callback) {
    let sql = `select product_id,orderd_data from products where products.product_id > 2073`;
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
            console.log(result.rows);
            return callback(null, result.rows);

        })
    })

}


module.exports = {
    fetchProducts,
    fetchProductByCat,
    savePath,
    saveRequest,
    saveProduct_image,
    createSerialNumber,
    editProducStatus,
    productInspection

}