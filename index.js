var express = require('express');
var app = express();
const port = 3000;

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(port, () => console.log("Listening on port 3000!"));