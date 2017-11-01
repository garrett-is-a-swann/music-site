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


router.route('/bands')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        pool.query('select * from dim_band;')
            .then(resp => {
                res.send(resp.rows);
            })
            .catch(err => {
                console.log(err.stack);
            });
    })
    .post((req, res, next) => {
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
    })
    .put((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .delete((req, res, next) => {
        next(new Error('Not implemented'));
    });

router.route('/register')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .post((req, res, next) => {
        console.log(req.body);
        const values = [];

        const errors = [];

        for (each in req.body)
        {
            values.push(req.body[each]);
        }
        console.log(values);
        pool.query('Select * from dim_user where username = $1', [req.body.username]).
            then(resp => {
                console.log('Checking username:', resp.rows);
                console.log(resp.rows.length)
                if( resp.rows.length )
                {
                    errors.push({'username':'Username has been taken.'});
                    for(each in errors)
                    {
                        console.log(each, errors[each]);
                    }

                    console.log('asdaS"ASDFASDFASDFAS');
                }
            })
            .catch(e => {
                //console.log(e);
            });
        pool.query('Select * from dim_user where email = $1', [req.body.email]).
            then(resp => {
                //console.log('Checking email', resp.rows);
                if( resp.rows.length )
                {
                    errors.push({'email':'Email is already in use.'});
                }
            })
            .catch(e => {
                //console.log(e);
            });
        //console.log('ERRORS ARE RIGHT HERE', errors)

        console.log('error length',errors.length);

        if( errors.length )
        {
            console.log(errors);
            res.send(errors);
        }
        else
        {
            pool.query('INSERT INTO dim_user (username, email, password, date_created)'
                    +' VALUES ($1, $2, $3, current_timestamp) RETURNING *', values)
                .then(resp => {
                    //console.log(resp);
                    //res.send(
                })
                .catch(e => {
                    //console.log(e);
                    //console.log('ERRORS ARE RIGHT HERE', errors)
                });
        }
    })

module.exports = router;
