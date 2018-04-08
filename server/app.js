const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');

// Include Configs Here

// Include Routes Here
const api = require('./routes/api');

const app = express();
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.use(express.static(path.join(__dirname, 'dist')));


router.use((req, res, next) => {
    console.log('Time: %s --- Connection from %s', Date('GMT'), req.headers['x-forwarded-for']);
    next();
});

router.use('/api', api);

router.use('/static', express.static(path.join(__dirname, 'static')));

// Catch-all route
router.route('*')
.all((req, res, next) => {
    next()
})
.get((req,res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

// Directory imports
//router.use(express.static(path.join(__dirname, 'configs')));

module.exports = router;
