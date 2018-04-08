const express = require('express');
const router = express.Router();

const db = require('../../db')

router.route('/bands')
    .all((req, res, next) => {
        next();
    })
    .get((req, res, next) => {
        if (req.session && req.session.user && req.session.user.list && req.session.user.select_list) {
            console.log("THIS SHOULD BE GOSU",req.session.user.list)
            db.query(`
                    SELECT b.name ,string_agg(g.name, '|') as genres
                    FROM mus.genre g
                        join mus.band_genre bg on g.id = bg.genreid
                        join mus.band b on b.id = bg.bandid right
                        join list_entry l on b.id = l.bandid
                        join user_list u on u.name = l.listname
                    WHERE u.userid = $1 AND u.name = $2
                    GROUP BY b.name
                `,[req.session.user.user_id, req.session.user.list[req.session.user.select_list-1].name], (e, resp) => {
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
        db.query(`
                SELECT username
                from mus.user_login
                WHERE id = $1
            `, [req.params.id], (e, resp) => {
            db.query(`
                    SELECT id, name
                    FROM(SELECT
                        ROW_NUMBER() OVER(PARTITION BY userid ORDER BY date_created) as id, *
                    FROM user_list WHERE userid = $1) as f
              `,[req.params.id],
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
            db.query(`
                    SELECT id, username
                    FROM mus.user_login
                    WHERE id = $1
              `,[req.session.user.user_id],
              (e, resp) => {
                if(e) {
                    console.log(e.stack);
                    res.json({success: false, message: 'Something went wrong'});
                }
                else {
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
            db.query(`INSERT INTO user_list (userid, name) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`
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
        db.query(`
                SELECT b.name
                FROM list_entry l
                    join mus.band b on b.id = l.bandid
                    join (
                        SELECT name, userid
                        ,ROW_NUMBER() OVER(PARTITION BY u.userid ORDER BY u.date_created) as rowid
                        FROM user_list u
                        WHERE
                            userid = $1
                        ) as u on u.name = l.listname
                WHERE u.rowid = $2 
                    AND l.userid = $1
                `,[req.params.id, req.params.page],(e, resp) => {
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

