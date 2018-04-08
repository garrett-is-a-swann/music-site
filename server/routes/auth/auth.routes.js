const express = require('express')
const router = express.Router();

const views = require('./auth.views')
const auth_ = require('./auth.middleware')




router.post('/validate-username', (req, res, next) => {
    views.checkUsername(req.body.username).then((resp)=>{
        res.json(resp);
    }).catch((err) => {
        console.log('Error: api/auth/validate-username', err);
    })
});


router.post('/validate-email', (req, res, next) => {
    views.checkEmail(req.body.email).then((resp) => { 
        res.json(resp);
    }).catch((err) => {
        console.log('Error: api/auth/validate-email', err);
    });
});


router.route('/register')
.all((req, res, next) => {
    next();
})
.get((req,res,next) => {
    next(new Error('Not implemented'));})
.post(async (req,res,next) => {
    try {
        if( (resp = await views.createUser(req.body)).success ) {
            req.WhoAmongUs.username = req.body.username;
            req.WhoAmongUs.uid = resp.id;
        }
        else
            res.json(resp)
    } catch(e) {
        res.json({success:false, message:"Uh oh! We hit a snag. Our interweb guru's are taking a closer look!"});
    }
})


router.route('/login')
.all((req, res, next) => {
    next();
}).post( async (req,res,next) => {
    auth_.authUser(req.body.username, req.body.password).then(resp => {
        if(resp.success == true) {
            req.WhoAmongUs.username = req.body.username;
            req.WhoAmongUs.uid = resp.uid;
        }
        res.send({success:true, mode:0, message:'Authentication successful.'})
    }).catch(err => {
        console.log(err)
        res.json(err);
    });
})

router.route('/is-auth')
.all((req, res, next) => {
    next();
}).get(auth_.isAuth, (req,res,next) => {
    if(req.WhoAmongUs && req.WhoAmongUs.username) {
        res.send({success:true, message:'Authentication successful.', username:req.WhoAmongUs.username})
    } else {
        res.send({success:false, message:'Not authenticated.'});
    }
})

router.route('/logout')
.all((req, res, next) => {
    next();
}).get((req, res) => {
    req.WhoAmongUs.reset();
    res.json({success: true, message:'Logout successful'});
});


module.exports = router;
