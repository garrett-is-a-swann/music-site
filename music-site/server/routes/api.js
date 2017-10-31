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

router.post('/bands', (req, res) => {
    console.log(req.body);

    const values = [];

    values.push(req.body.name);
    console.log(req.body.name);

    pool.query('SELECT * FROM dim_band WHERE name = $1', values)
        .then(resp=> {
            console.log(resp.rows);
            if(resp.rows.length) {
                // DO THIS ONCE WE GET USERS AUTHENTICATED AND WORKING
                /* 
                pool.query(
                        'INSERT into dim_band_link(account_id, bandname) VALUES($1, $2) RETURNING *'
                        , values)
                    .then(_resp => {
                        
                    })
                    .catch(_e => {
                        console.log(_e.stack);
                    });
                */

            }
        })
        .catch(e => {
            console.log(e.stack);
        });
});


module.exports = router;
