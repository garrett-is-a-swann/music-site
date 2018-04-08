const { Pool } = require('pg');
const config = require('../configs/dbconfig.json');

const pool = new Pool({
        user: config.user
        ,hose: config.hose
        ,database: config.database
        ,password: config.password
        ,port: config.port
});

module.exports = { 
    query: (text, params, callback) => {
        const start = Date.now();
        return pool.query(text, params, (err, res) => {
            if(err) {
                throw err
            }
            const duration = Date.now() - start;
            //console.log('Executed query', {text, duration, rows: res.rowCount });
            callback(err,res);
        });
    },
    getClient: (callback) =>{
        pool.connect((err, client, done) => {
            client.query = () => {
                client.lastQuery = arguments;
                client.query.apply(client, arguments);
            }
            const timeout = setTimeout(() => {
                console.error('A client has been checked out for more than 5 seconds!');
                console.error(`The last executed query on this client was ${client.lastQuery}`)
            }, 5000);

            const release = (err) => {
                done(err);
                clearTimeout(timeout);
                client.query = query;
            }

            callback(err, client, done);
        })
    }
}
