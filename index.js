const express = require("express");
const cors = require("cors");
const fs = require("fs");
var path = require("path")

const app = express();
const BASE_URL = 'app url goes here'; // TODO set base url

app.engine('html', require('ejs').renderFile)

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
    res.sendFile(process.cwd() + "/public/index.html");
});

app.listen(3000, function() {
    console.log("Your app is listening on port 3000");
});