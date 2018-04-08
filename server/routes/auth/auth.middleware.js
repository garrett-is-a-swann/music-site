const express = require('express')
const router = express.Router();

const config = require('../../configs/sessionconfig.json');
const hashconf = config.hashconf;
const crypto = require('crypto');

const views = require('./auth.views')




// Public

function verifyPassword(password, hash, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, Buffer(salt, 'hex'), hashconf.iterations, hashconf.hashBytes, 'sha512', (err, verify) => {
            if (err) { // wtf lmao
                console.log('wtf lmao', err);
                reject(err);
            }
            resolve(verify.toString('hex') == hash);
        });
    });
}


function authUser(username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const username_check = await views.checkUsername(username);
            if(username_check.mode == 0) {
                reject({success:false, mode: 1, message:'Username is not in use.'});
                return;
            }
            if(username_check.mode == -1) {
                reject(username_check);
                return;
            }
            const password_check = await views.checkPassword(password)
            if(password_check.mode != 1) {
                reject(password_check);
                return;
            }
            hashbrowns = await views.getUserHash(username);
            verifyPassword(password, hashbrowns.hash, hashbrowns.salt).then(resp => {
                if(resp) {
                    resolve({success:true, uid:username_check.uid})
                } else {
                    reject({success:false, mode:2, message:'Incorrect password.'})
                }
            }).catch(e => {
                console.log(e)
                reject(e)
            });
        } catch(e) {
            console.log(e);
            reject(e)
        }
        
    });
}

// Middleware

function isAuth_Ware(req, res, next) {
    if(req.WhoAmongUs && req.WhoAmongUs.username) {
        console.log(req.WhoAmongUs.username, 'is checking their authentication for route',req.path)
        next();
    } else {
        console.log(req.headers['x-forwarded-for'], 'is not authenticated for route',req.path)
        res.send({success:false, message:'Not authenticated.'});
    }
}

module.exports = {
    router:router
    ,verifyPassword:verifyPassword
    ,authUser:authUser
    ,isAuth:isAuth_Ware
    ,hashPass:views.hashPass
    ,verifyPass:verifyPassword
};
