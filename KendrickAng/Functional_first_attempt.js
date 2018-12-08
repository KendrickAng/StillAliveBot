/*
GOAL: write function long_poll that takes
    1. unary function that does something to the (JSON) output
    2. message to send to the person communicating with the bot.
FUNCTIONS:
- getUpdates
- sendMessage
get the url, post the url with request (returning a promise)
*/

const request = require('request');
let update_id = 0;

function long_poll() {

}

// method: @String, callback: @function
function request_http(method, type, callback, params={}) {
    return request({
        uri: get_uri(method),
        method: type,
        headers: params,
        json: true
    }, get_callback(callback));
}

// takes a unary function that does something to the result
function get_callback(func) {
    return function(error, res, body) {
        if(error) {
            console.log(error);
        } else {
            return func(body);
        }
    }
}

function get_updates(offset=0, limit=100, timeout=0, allowed_updates=[]) {
    const params = {
        offset: offset,
        limit: limit,
        timeout: timeout,
        allowed_updates: allowed_updates
    };
    return request_http("getUpdates", "POST", process_updates, params);
}

// input: json body object with @Array of Updates, also confirms that the updates have been processed
function process_updates(res) {
    const updates = res.result;
    for(let i = 0; i < updates.length; i++) {
        update_id = process_update(updates[i]);
    }
    console.log(update_id);
}
// input: update object, output: id of last update object
function process_update(update) {
    const update_id = update.update_id;
    const player_id = update.message.chat.id;
    const text = update.message.text;
    switch(text) {
        case "/help":
            console.log("HELP WAS ASKED!");
            break;
        default:
            console.log("I dont know how to answer that");
            break;
    }
    return update_id;
}

function get_uri(method) {
    return "https://api.telegram.org/bot671406474:AAE_PSiJw8aESyuXN58-IRR9kH97v3SVcFE/"
        + method;
}

get_updates();
