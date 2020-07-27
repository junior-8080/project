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


function report(data, callback) {
    let sql = 'insert into reports(product_id,report) values($1,$2) returning report_id';
    let values = [data.id, data.report]

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

module.exports = {
    report,
}