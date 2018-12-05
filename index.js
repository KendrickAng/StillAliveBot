var express = require('express');
var app = express();
var body_parser = require('body-parser');
const port = 3000;

app.use(body_parser.json()); // set application/json parser as middleware
app.use(body_parser.urlencoded({
    extended: true
})); // set application/x-www-form-urlencoded as middleware

// POST sends data to a server to create/update a resource
app.post('/new-message', function(req, res) {
    const message = req.body;
    console.log(message);
});
app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(port, () => console.log("Listening on port 3000!"));