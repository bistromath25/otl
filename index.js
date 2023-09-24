const express = require('express');
const cors = require('cors');
const fs = require('fs');
var path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const json = require('stream/consumers');
const favicon = require('serve-favicon');
const db = new sqlite3.Database('./links.db');
//const jsdom = require('jsdom');
db.run('CREATE TABLE IF NOT EXISTS links(real TEXT, short TEXT, visited BOOLEAN)');

const app = express();
const BASE_URL = 'localhost:3000'; // TODO set base url

const { JSDOM } = jsdom;
const dom = new JSDOM('<input id="shortenedUrl" class="appearance-none block w-full bg-gray-200 text-gray-700 mr-3 border border-black-500 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="url-to-your-site">');
global.document = dom.window.document;

app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/public', express.static(process.cwd() + '/public'));
app.use(favicon(path.join(__dirname + '/public/opera.ico')));

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

function copyLink() {
    // copy the shortened url
    document.getElementById('shortenedUrl').select()
    document.execCommand('copy');
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

    //const ret = document.getElementById('shortenedUrl'); 
    //console.log(ret === undefined);
    //ret.textContent = BASE_URL + '/' + short; 
    
    // res.sendFile(process.cwd() + '/public/index.html');
    res.render(__dirname + '/public/index.html', {'placeholder': short});
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
