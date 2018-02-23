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
                        req.session.user.selected_list = 1
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
                                +' VALUES ($1, $2, $3, $4, $5, current_timestamp) RETURNING *'
                                  ,[req.body.username, hashed[0].toString('hex')
                                    , hashed[1].toString('hex')
                                    , resp.rows[0].id, 10 ]).then(
                                  (resp) => {
                            req.session.user = req.body;
                            req.session.user.user_id = resp.rows[0].id
                            req.session.user.permission = resp.rows[0].permission
                            delete req.session.user.password_hash;
                            delete req.session.user.password_salt;
                            console.log(req.session.user, ' has logged in');
                            res.status(201).send({success: true, message: 'User created'})
                            pool.query("INSERT INTO user_list (userid, name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *"
                              ,[req.session.user.user_id, 'Default'], 
                              (_e, _resp) => {
                                if(_e) {
                                    console.log(_e.stack);
                                }
                                else {
                                    // Create default list for the user.
                                }
                                req.session.user.selected_list = 1
                            })
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
                req.session.user.user_id = resp.rows[0].id
                req.session.user.permission = resp.rows[0].permission
                delete req.session.user.password_hash;
                delete req.session.user.password_salt;
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
        if (req.session && req.session.user && req.session.user.list && req.session.user.select_list) {
            console.log("THIS SHOULD BE GOSU",req.session.user.list)
            pool.query(
                "SELECT b.name ,string_agg(g.name, '|') as genres "
                +"FROM dim_genre g "
                +"join fct_band_genre bg on g.id = bg.genreid "
                +"join dim_band b on b.id = bg.bandid right "
                +"join list_entry l on b.id = l.bandid "
                +"join user_list u on u.name = l.listname "
                +"WHERE u.userid = $1 AND u.name = $2 "
                +"GROUP BY b.name"
              ,[req.session.user.user_id, req.session.user.list[req.session.user.select_list-1].name], (e, resp) => {
                  console.log(req.session.user.list[req.session.user.select_list-1].name)
                if(e) {
                    res.json({success: false, message: 'Something went wrong'});
                    console.log(e.stack);
                }
                else {
                    res.json({success: true, message: 'All links', json: resp.rows});
                }
            })
        }
    })
    .post((req, res, next) => {
        console.log(req.body.name);
        pool.query('SELECT id, name '
                +'FROM dim_band '
                +"WHERE substring(regexp_replace(lower(name), '[^a-z]', '', 'g') from $1) like '%_%' "
                +'Limit 10 ',
                ['.*'+req.body.name.toLowerCase().split(/[^a-z]/).join('')+'.*'], (e, resp) => {
            if(e){
                console.log(e.stack);
            }
            else {
                console.log(resp.rows);
                if(resp.rows.length) {
                    console.log(req.session.user)
                        pool.query("SELECT b.name, string_agg(g.name, '|') as genres "
                                +"FROM dim_genre g join fct_band_genre bg on g.id = bg.genreid join dim_band b on b.id = bg.bandid "
                                +"WHERE substring(regexp_replace(lower(b.name), '[^a-z]', '', 'g') from $1) like '%_%' "
                                +"GROUP BY b.name "
                                +"Limit 10 ",
                                ['.*'+req.body.name.toLowerCase().split(/[^a-z]/).join('')+'.*'], (_e, _resp) => {
                            if(_e) {
                                console.log(_e.stack);
                                res.json({success: false, message: 'Something went wrong'});
                                return
                            }
                            else {
                                console.log(_resp.rows[0])
                                res.json({success: true, message: 'Added Link', json: _resp.rows[0]});
                            }
                        })
                    if(req.session.user) {
                        console.log(req.session.user.list)
                        pool.query('INSERT into list_entry(userid, listname, bandid) VALUES($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *'
                            ,[req.session.user.user_id, req.session.user.list[req.session.user.select_list-1].name, resp.rows[0].id],
                            (_e, _resp) => 
                        {
                            if(_e) {
                                console.log(_e.stack);
                                res.json({success: false, message: 'Something went wrong'});
                            }
                        })
                    }
                }
                else {
                    console.log('Band not found. This is where we should log IP, bname, and User if available');
                    var ip = req.headers['x-forwarded-for'];
                    console.log(ip)
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

router.param('id', function (req, res, next, value) {
    next();
});

router.route('/user/:id')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        pool.query("SELECT username "
                +"from fct_user_login "
                +"WHERE id = $1", 
          [req.params.id], (e, resp) => {
            pool.query(
                    "SELECT id, name "
                    +"FROM(SELECT "
                    +"ROW_NUMBER() OVER(PARTITION BY userid ORDER BY date_created) as id, * "
                    +"FROM user_list WHERE userid = $1) as f"
              ,[req.params.id],
              (_e, _resp) => {
                if(e || _e) {
                    console.log(e.stack);
                    console.log(_e.stack);
                    res.json({success: false, message: 'Something went wrong'});
                }
                else {
                    console.log(_resp.rows)
                    req.session.user.list = _resp.rows;
                    res.json({
                        success: true
                        ,message: 'Details of id<' + req.params.id + '>'
                        ,json:{
                            userid: req.params.id
                            ,username: resp.rows[0].username
                            ,list: _resp.rows}});
                }
            })
        })
    })
    .post((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .put((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .delete((req, res, next) => {
        next(new Error('Not implemented'));
    });

router.route('/user')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        if (req.session && req.session.user) {
            console.log('id is', req.session.user.user_id)
            pool.query(
                    "SELECT id, username "
                    +"FROM fct_user_login "
                    +"WHERE id = $1 "
              ,[req.session.user.user_id],
              (e, resp) => {
                if(e) {
                    console.log(e.stack);
                    res.json({success: false, message: 'Something went wrong'});
                }
                else {
                    console.log(resp.rows)
                    res.json({
                        success: true
                        ,message: 'All links'
                        ,json:{
                            userid: req.session.user.user_id
                            ,username: resp.rows[0].username}});
                }
            })
        } else {
            res.json({success: false, message: 'No logged in user.'});
        }
    })
    .post((req, res, next) => {
        if (req.session && req.session.user) {
            console.log(req.body)
            pool.query("INSERT INTO user_list (userid, name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *"
              ,[req.session.user.user_id, req.body.name]
              ,(e, resp) => {
                if(e) {
                    console.log(e.stack);
                    res.json({success: false, message: 'List name is already in use.'});
                }
                else {
                    res.json({success: true, message: 'All links', json: resp.rows});
                }
            })
        }
    })
    .put((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .delete((req, res, next) => {
        next(new Error('Not implemented'));
    });

router.param(['id', 'page'], function (req, res, next, value) {
    next();
});

router.route('/user/:id/list/:page')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        console.log(req.params.id, req.params.page)
        req.session.user.select_list = req.params.page
        pool.query(
            "SELECT b.name "
            +"FROM list_entry l "
                +"join dim_band b on b.id = l.bandid "
                +"join ("
                    +"SELECT name, userid"
                        +",ROW_NUMBER() OVER(PARTITION BY u.userid ORDER BY u.date_created) as rowid "
                    +"FROM "
                        +"user_list u "
                    +"WHERE "
                        +"userid = $1 "
                    +") as u on u.name = l.listname "
            +"WHERE u.rowid = $2 AND l.userid = $1"
          ,[req.params.id, req.params.page]
          ,(e, resp) => {
            if(e) {
                console.log(e.stack);
            }
            else {
                console.log(resp.rows)
                res.json({success: true, message: 'Here are your bands bro', json: resp.rows});
            }
        })
    })
    .post((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .put((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .delete((req, res, next) => {
        next(new Error('Not implemented'));
    })





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




/* REFERENCE

router.route('/xxxx')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        if (req.session && req.session.user) {
            pool.query("SELECT * FROM table where id=$1"
              ,[req.session.user.user_id], 
              (e, resp) => {
                if(e) {
                    console.log(e.stack);
                }
                else {
                    res.json({success: true, message: 'All links', json: resp.rows});
                }
            })
        }
    })
    .post((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .put((req, res, next) => {
        next(new Error('Not implemented'));
    })
    .delete((req, res, next) => {
        next(new Error('Not implemented'));
    })
 

*/
