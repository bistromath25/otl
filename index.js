const express = require("express");
const cors = require("cors");
const fs = require("fs");
var path = require("path");

const app = express();
const BASE_URL = 'app url goes here'; // TODO set base url

app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
    res.sendFile(process.cwd() + "/public/index.html");
});

// generate random alphanumeric string of length n
function generate(n) {
    var res = "";
    var an="1234567890abcdefhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < n; i++) {
        res += an.charAt(Math.floor((Math.random() * an.length)) % an.length);
    }
    return res;
}

app.listen(3000, function() {
    console.log("Your app is listening on port 3000");
});