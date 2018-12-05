var express = require('express');
var app = express();
var body_parser = require('body-parser');
var axios = require('axios');
const api = "https://api.telegram.org/bot671406474:AAE_PSiJw8aESyuXN58-IRR9kH97v3SVcFE/";
const port = 3000;

app.use(body_parser.json()); // set application/json parser as middleware
app.use(body_parser.urlencoded({
    extended: true
})); // set application/x-www-form-urlencoded as middleware

app.get('/', function(req, res) {
    axios.get(api + "getMe")
        .then(function(response) {
            console.log(response.data.result);
        })
        .catch(function(error) {
            console.log(error);
        })
    res.send("done");
});

app.get('/sendMessage', function(req, res) {
    const input = {
        chat_id = "StillAliveBot",
        text = "hello"
    };
    axios.post(api + "sendMessage", input)
        .then()
})

app.listen(port, () => console.log("Listening on port 3000!"));