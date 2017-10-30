const express = require('express');
const router = express.Router();


// Do PostgresSQL stuff
const { Pool,Client } = require('pg')
const pool = new Pool()

/* API DESCRIPTION *\

    URL: /bands
    Function: GET
    Action: All of the [user] bands

\*                 */


// GET api listing 
router.get('/', (req, res) => {
    res.send('api works');
});


router.get('/bands', (req, res) => {
    pool.query('select * from dim_band;')
        .then(resp => {
            res.send(resp.rows);
        })
        .catch(err => {
            console.log(err.stack);
        });
});


module.exports = router;
