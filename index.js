const express = require('express');
const cors = require('cors');
const fs = require('fs');
var path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const json = require('stream/consumers');
const favicon = require('serve-favicon');
const db = new sqlite3.Database('./links.db');
db.run('CREATE TABLE IF NOT EXISTS links(real TEXT, short TEXT, visited BOOLEAN)');

const app = express();
const BASE_URL = 'localhost:3000'; // TODO set base url

app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/public', express.static(process.cwd() + '/public'));
app.use(favicon(path.join(__dirname + '/public/opera.ico')));

app.get('/', function(req, res) {
    res.render(process.cwd() + '/public/index.html', {'link' : ''});
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

app.post('/upload', function(req, res) {
    var real = req.body.real; // get the real url
    var short = generate(5); // generate the short url
    console.log(short);
    
    db.run(`INSERT INTO links(real, short, visited) VALUES(?, ?, ?)`, [real, short, false], function(e) {
        if (e) {
            return console.log(e);
        }
    });

    res.render(__dirname + '/public/index.html', {'link': BASE_URL + "/" + short});
});

app.get('/:link', function(req, res) {
    var short = req.params.link;
    console.log(req.params);
    console.log(short);
    const queryFetch = 'SELECT * FROM links WHERE short = ?';
    const queryUpdate = 'UPDATE links SET visited = true WHERE short = ?'
    db.get(queryFetch, [short], function(e, row) {
        if (e || row === undefined) {
            console.log(e);
            res.sendFile(process.cwd() + '/public/error.html');
        } else {
            console.log(row);
            if (row.visited === 0) { // only redirect if link has not yet been visited
                res.redirect('//' + row.real);
            } else {
                res.sendFile(process.cwd() + '/public/alreadyvisited.html');
            }
        }
    });
    db.run(queryUpdate, [short], function(e) {
        if (e) {
            return console.log(e);
        }
    });
});

app.listen(3000, function() {
    console.log('Your app is listening on port 3000');
});
