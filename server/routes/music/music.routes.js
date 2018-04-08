const express = require('express');
const router = express.Router();

const db = require('../../db')

router.route('/bands')
    .all((req, res, next) => {
        next();
    })
    .post((req, res, next) => {
        console.log(req.body.name);
        db.query(`
                SELECT id, name
                FROM mus.band
                WHERE substring(regexp_replace(lower(name), '[^a-z]', '', 'g') from $1) like '%_%'
                LIMIT 10
                `,['.*'+req.body.name.toLowerCase().split(/[^a-z]/).join('')+'.*'], (e, resp) => {
            if(e){
                console.log(e.stack);
            }
            else {
                if(resp.rows.length) {
                        db.query(`
                                SELECT b.name, string_agg(g.name, '|') as genres
                                FROM mus.genre g join mus.band_genre bg on g.id = bg.genreid join mus.band b on b.id = bg.bandid
                                WHERE substring(regexp_replace(lower(b.name), '[^a-z]', '', 'g') from $1) like '%_%'
                                GROUP BY b.name
                                Limit 10
                                `,['.*'+req.body.name.toLowerCase().split(/[^a-z]/).join('')+'.*'], (_e, _resp) => {
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

                        /*
                    if(req.session.user) {
                        console.log(req.session.user.list)
                        db.query(`
                                INSERT into list_entry(userid, listname, bandid) VALUES($1, $2, $3) 
                                ON CONFLICT 
                                    DO NOTHING 
                                RETURNING *`
                            ,[req.session.user.user_id, req.session.user.list[req.session.user.select_list-1].name, resp.rows[0].id],
                            (_e, _resp) => 
                        {
                            if(_e) {
                                console.log(_e.stack);
                                res.json({success: false, message: 'Something went wrong'});
                            }
                        })
                    }
                    */
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

module.exports = router;
