const express = require('express');
const cors = require('cors');
const fs = require('fs');
var path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const db = new sqlite3.Database('./links.db');
db.run('CREATE TABLE IF NOT EXISTS links(real TEXT, short TEXT, visits INTEGER)');

const app = express();
const BASE_URL = 'app url goes here'; // TODO set base url

app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/public/index.html');
});

function generate(n) {
    // generate random alphanumeric string of length n
    var res = '';
    const an='1234567890abcdefhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < n; i++) {
        res += an.charAt(Math.floor((Math.random() * an.length)) % an.length);
    }
    return res;
}

function saveUrl() {
    // add the url into the database
}

function copyLink() {
    // copy the shortened url
    document.getElementById('shortenedUrl').select()
    document.execCommand('copy');
}

app.post('/upload', function(req, res) {
    var real = req.body.real; // get the real url
    var short = generate(5); // generate the short url
    db.run(`INSERT INTO links(real, short, visits) VALUES(?, ?, ?)`, [real, short, 0], function(e) {
        if (e) {
            return console.log(e);
        }
    });
    res.sendFile(process.cwd() + '/public/index.html');
});

app.listen(3000, function() {
    console.log('Your app is listening on port 3000');
});
