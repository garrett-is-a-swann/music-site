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
        const values = [];

        const errors = {};

        for (each in req.body)
        {
            values.push(req.body[each]);
        }

        pool.query('Select * from dim_user where username = $1', [req.body.username],
            (e, resp) =>
            {
                if(e)
                {
                    console.log(e);
                }
                else{
                    if( resp.rows.length )
                    {
                        errors['username']='Username has been taken.';
                    }
                }
                pool.query('Select * from dim_user where email = $1', [req.body.email],
                    (e, resp) => {
                        if(e){
                            console.log(e);
                        }
                        else{
                            if( resp.rows.length )
                            {
                                errors['email']='Email is already in use.';
                            }
                        }

                        if( Object.keys(errors).length )
                        {
                            res.send(errors);
                        }
                        else
                        {
                            pool.query('INSERT INTO dim_user (username, email, password, date_created)'
                                    +' VALUES ($1, $2, $3, current_timestamp) RETURNING *', values)
                                .then(resp => {
                                    console.log(resp);
                                })
                            .catch(e => {
                                console.log(e);
                            });
                        }
                    })
            })
    })

module.exports = router;
