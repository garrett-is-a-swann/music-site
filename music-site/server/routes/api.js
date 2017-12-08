const express = require('express');
const router = express.Router();
const config = require('./config.json');

const jwt = require('jsonwebtoken');

const session = require('client-sessions');
router.use(session({
    cookieName: 'session',
    secret: config.cookieKey,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// Do PostgresSQL stuff
const { Pool,Client } = require('pg')
const pool = new Pool({
    connectionString: config.psqlConn
})

// Crypto
const crypto = require('crypto');
const hashconf = config.hashconf;


function hashPassword(password, callback) {
  // generate a salt for pbkdf2
  crypto.randomBytes(hashconf.saltBytes, function(err, salt) {
    if (err) {
      return callback(err);
    }
    console.log(salt);

    crypto.pbkdf2(password, salt, hashconf.iterations, hashconf.hashBytes, 'sha512', (err, hash) => {

      if (err) {
        return callback(err);
      }

      var combined = [hash, salt];

      callback(null, combined);
    });
  });
}

function verifyPassword(password, combined, callback) {
  crypto.pbkdf2(password, Buffer(combined[1],'hex'), hashconf.iterations, hashconf.hashBytes, 'sha512', (err, verify) => {
    if (err) {
      return callback(err, false);
    }
    console.log(combined);
    console.log(verify.toString('hex'))
       
    callback(null, verify.toString('hex') == combined[0]);
  });
}


/* API DESCRIPTION *\

    URL: /bands
    Function: GET
    Action: All of the [user] bands

\*                 */


router.route('/authenticate')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .post((req, res, next) => {
        pool.query('Select password_hash, password_salt, user_id, permission from fct_user_login where username = $1', [req.body.username], (e, resp) => {
            if(e) {
                console.log(e);
                res.status(404).json({success: false, message: 'Authentication failed: Something went awry.'});
                return;
            }
            else {
                if(!resp.rows.length) {
                    res.status(404).json({success: false, message: 'Authentication failed: User not found.'});
                    return;
                }
                verifyPassword(req.body.password, [resp.rows[0].password_hash, resp.rows[0].password_salt], (e, s) => {
                    if(e) {
                        console.log(e)
                        res.status(404).json({success: false, message: 'Authentication failed: Something went awry.'});
                        return;
                    }
                    else {
                        req.session.user = resp.rows[0];
                        console.log(req.session.user)
                        delete req.session.user.password_hash;
                        delete req.session.user.password_salt;
                        console.log(s);
                        if(s) {
                            const payload = { permissions: resp.rows[0].permission };
                            var token = jwt.sign(payload, config.secret, {
                                expiresIn: '1440m'
                            });
                            res.status(200).json({success: true, message: 'Authenticated', token: token});
                        }
                        else {
                            res.status(400).json({success: false, message: 'Authentication failed: Wrong Password.'});
                            return;
                        }
                    }
                });

            }
        })
    })


//Register
router.route('/register')
    .all((req,res,next) => {
        next();
    })
    .get((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .post((req, res, next) => {
        const errors = {};
        hashPassword(req.body.password, (err, hashed)=> {
            if(err) {
                return;
            }
            console.log(hashed);

            pool.query('Select * from dim_user where email = $1', [req.body.email], (e, resp) => {
                if(e) {
                    console.log(e);
                }
                else {
                    if( resp.rows.length ) {
                        errors['email']='Email has been taken.';
                    }
                    console.log(resp)
                }
                pool.query('Select * from fct_user_login where username = $1', [req.body.username], (e, resp) => {
                    if(e) {
                        console.log(e);
                    }
                    else {
                        if( resp.rows.length ) {
                            errors['username']='Username is already in use.';
                        }
                        console.log(resp)
                    }

                    if(Object.keys(errors).length) {
                        res.status(400).send({success: false, message: 'User created', errors: errors})
                    }
                    else {
                        pool.query('INSERT INTO dim_user (email, date_created)'
                                +' VALUES ($1, current_timestamp) RETURNING id', [req.body.email]).then(resp => {
                            pool.query('INSERT INTO fct_user_login (username, password_hash, password_salt, user_id, permission, date_created)'
                                    +' VALUES ($1, $2, $3, $4, $5, current_timestamp) RETURNING *', [req.body.username, hashed[0].toString('hex'), hashed[1].toString('hex'), resp.rows[0].id, 10 ]).then(resp => {
                                req.session.user = req.body;
                                req.session.user.user_id = resp.rows[0].id
                                req.session.user.permission = resp.rows[0].permission
                                delete req.session.user.password_hash;
                                delete req.session.user.password_salt;
                                console.log(req.session.user, ' has logged in');
                                res.status(201).send({success: true, message: 'User created'})
                            }).catch(e => {
                                console.log(e);
                            });
                        }).catch(e => {
                            console.log(e);
                        });
                    }
                })
            })
        })
    })



    
router.use((req, res, next) => {
    if (req.session && req.session.user) {
        pool.query('Select * from fct_user_login where username = $1', [req.session.user.username], (e, resp) => {
            if ( resp.rows.length ) {
                //req.user = user;
                delete req.session.user.password_hash;
                delete req.session.user.password_salt;
                req.session.user = user;  //refresh the session value
                //res.locals.user = user;
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
});


// GET api listing 
router.get('/', (req, res) => {
    res.send('api works');
});


router.route('/bands')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        pool.query("SELECT b.name ,string_agg(g.name, '|') as genres FROM dim_genre g join fct_band_genre bg on g.id = bg.genreid join dim_band b on b.id = bg.bandid right join fct_user_band bu on b.id = bu.bandid WHERE bu.userid = $1 GROUP BY b.name", [req.session.user.user_id], (e, resp) => {
            if(e) {
                console.log(e.stack);
            }
            else {
                res.json({success: true, message: 'All links', json: resp.rows});
            }
        })
    })
    .post((req, res, next) => {
        console.log(req.body.name);
        pool.query('SELECT id, name FROM dim_band WHERE name = $1', [req.body.name], (e, resp) => {
            if(e){
                console.log(e.stack);
            }
            else {
                console.log(resp.rows);
                if(resp.rows.length) {
                    console.log(req.session.user)
                    pool.query("SELECT b.name, string_agg(g.name, '|') as genres FROM dim_genre g join fct_band_genre bg on g.id = bg.genreid join dim_band b on b.id = bg.bandid WHERE b.name = $1 GROUP BY b.name",
                            [req.body.name], (_e, _resp) => {
                                if(_e) {
                                    console.log(_e.stack);
                                    res.json({success: false, message: 'Something went wrong'});
                                }
                                else {
                                    console.log(_resp.rows[0])
                                    res.json({success: true, message: 'Added Link', json: _resp.rows[0]});
                                }
                            })
                    pool.query('INSERT into fct_user_band(userid, bandid, date_added) VALUES($1, $2, current_timestamp) ON CONFLICT DO NOTHING RETURNING *', [req.session.user.user_id, resp.rows[0].id],
                        (_e, _resp) => {
                            if(_e) {
                                console.log(_e.stack);
                                res.json({success: false, message: 'Something went wrong'});
                            }
                        })
                    }
                }
            })
        })
    .put((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .delete((req, res, next) => {
        next(new Error('Not implemented'));
    });


/*
router.route('/login').all((req,res,next)=> {
        next();
    }) .get((req, res, next) => {
        next(new Error('Not implemented'));
    }) .post((req, res, next) => {
        pool.query('Select password_hash, password_salt, permission from fct_user_login where username = $1', [req.body.username], (e, resp) => {
            if(e) {
                console.log(e);
                res.status(404).json({success: false, message: 'Authentication failed: Something went awry.'});
                return;
            }
            else {
                if(!resp.rows.length) {
                    res.status(404).json({success: false, message: 'Authentication failed: User not found.'});
                    return;
                }
                verifyPassword(req.body.password, [resp.rows[0].password_hash, resp.rows[0].password_salt], (e, s) => {
                    if(e) {
                        console.log(e)
                        res.status(404).json({success: false, message: 'Authentication failed: Something went awry.'});
                        return;
                    }
                    else {
                        console.log(s);
                        if(s) {
                            const payload = { permissions: resp.rows[0].permission };
                            var token = jwt.sign(payload, config.secret, {
                                expiresInMinutes: 1440
                            });
                            res.status(200).json({success: true, message: 'Authenticated', token: token});
                        }
                        else {
                            res.status(400).json({success: false, message: 'Authentication failed: Wrong Password.'});
                            return;
                        }
                    }
                });
            }
        })
    })
    */


module.exports = router;
