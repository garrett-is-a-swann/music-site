const express = require('express')
const router = express.Router();

const config = require('../../configs/sessionconfig.json');
const hashconf = config.hashconf;
const crypto = require('crypto');

const db = require('../../db')

function checkRegisterForm(form) {
    return new Promise(async (resolve, reject) => {
        var formCheck = {
            username:await checkUsername(form.username)
            ,password:await checkPassword(form.password)
            ,email:await checkEmail(form.email)
        }
        if( formCheck.username.success && formCheck.password.success && formCheck.email.success ) {
            resolve({success:true, mode: 1, message:'All methods passed checks'})
            return;
        }
        resolve({success:false, mode: 0, message:'One or methods failed checks.', json:formCheck});
    });
}


// Public

function hashPass(password) { // Probably should be middleware or elseware HEH
    // generate a salt for pbkdf2
    return new Promise((resolve, reject) => {
        crypto.randomBytes(hashconf.saltBytes, (err, salt) => {
            if (err) {
                reject(err);
                return;
            }
            crypto.pbkdf2(password, salt, hashconf.iterations, hashconf.hashBytes, 'sha512', (err, hash) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({hash:hash.toString('hex'), salt:salt.toString('hex')});
            });
        });
    });
}


function checkUsername(username) {
    return new Promise((resolve, reject)=> {
        if(/^[a-zA-Z0-9._!@$~|-]{4,64}$/.exec(username) == null) {
            resolve({success:false, mode: -1, message:'Error: Improper format for username.'})
        }
        return db.query('SELECT username, id FROM mus.user WHERE username = $1', [username], (err, res) => {
            if(err) {
                reject(err);
                return;
            }
            if(res.rowCount) {
                const resp = {success: true, mode: 1, message:res.rows[0].username+' is in use.', uid: res.rows[0].id}
                resolve(resp)
            }
            else {
                const resp = {success: true, mode: 0, message:username+' is available.'}
                resolve(resp);
            }
        })
    })
}

function checkPassword(password) {
    return new Promise((resolve, reject) => {
        if(/[!-~]{8,64}/.exec(password) == null) {
            resolve({success:false, mode:-1, message:'Error: Improper format for password.'});
            return;
        }
        if( /(?=.*[a-z])/.exec(password) == null
            || /(?=.*[A-Z])/.exec(password) == null
            || /(?=.*[!-@[-`{-~])/.exec(password) == null)
        {
            resolve({success:false, mode: -1, message:'Error: Improper format for password.'});
            return;
        }
        resolve({success:true, mode:1, message:'Valid password.'});
    });
}


function checkEmail(email) {
    return new Promise((resolve, reject) => {
        if( email == undefined || email.length == 0 ) {
            resolve({success: true, mode: 0, message: 'Email is optional'});
            return;
        }
        if(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.exec(email) == null) {
            resolve({success:false, mode: -1, message:'Error: Improper format for email.'});
        }
        return db.query('SELECT email FROM mus.user WHERE email = $1;', [email], (err, res) => {
            if(err) {
                reject(err);
                return;
            }
            if(res.rowCount) {
                resolve({success: false, mode: 0, message:res.rows[0].email+' is in use.'});
                return;
            }
            else {
                resolve({success: true, mode: 1, message:email+' is available.'});
                return;
            }
        });
    });
}

function createUser(form) {
    return new Promise(async (resolve, reject) => {
        try {
            if( (resp = await checkRegisterForm(form)).success) {
                var superSecretShhh = await hashPass(form.password)
                var values = [form.username, superSecretShhh.salt, superSecretShhh.hash, form.first_name, form.last_name, form.email]
                db.query('INSERT INTO mus.user '
                        +'(username, salt, hash, first_name, last_name, email) '
                        +'values ($1, $2, $3, $4, $5, $6) RETURNING *;',values, (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve({success:true, mode: 1, id:res.rows[0].id, message:'User '+res.rows[0].username+' created!'});
                }})
            } else {
                resolve(resp);
            }
        } catch (e) {
            reject(e)
        }
    });
}

function getUserHash(username) {
    return new Promise((resolve, reject) => {
        try {
            db.query('SELECT hash, salt '
                    +'FROM mus.user '
                    +'WHERE username = $1;', [username], (err, res) => {
                if(err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    resolve({hash:res.rows[0].hash, salt:res.rows[0].salt, username:username})
                }
            });
        } catch (e) {
            console.log(e)
            reject(e)
        }
    });
}

module.exports = {
    checkUsername: checkUsername
    ,checkPassword:checkPassword
    ,checkEmail: checkEmail
    ,createUser: createUser
    ,getUserHash: getUserHash
    ,hashPass: hashPass

}
