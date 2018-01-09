const express = require('express'); // duh
const path = require('path'); // Loads pathing
const http = require('http'); // Loads HTTP
const bodyParser = require('body-parser'); // This is middleware to bind angular to our express server.
const jwt = require('jsonwebtoken');

const api = require('./server/routes/api');

const app = express();
app.enable('trust proxy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Set our api routes
app.use('/api', api);

// ADD MORE ROUTES HERE.. * COMES LAST




// Catch all other routes and return index file for now
app.get('*', (req, res) => {
    if (!req.user) {
    } else {
        next();
    }
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Store port in Express
const port = process.env.PORT || '3001';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on our port, on all netwrok interfaces
server.listen(port, ()=> console.log(`API running on localhost:${ port }`));

