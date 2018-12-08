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
let forever = true;

function long_poll() {
    console.log("Offset is: ", update_id);
    get_updates(update_id, 100, 120);
}

long_poll();

// ******************************************** TELEGRAM METHODS ****************************************************
// calls getUpdates through POST, and calls process_updates on the resulting JSON Update array
function get_updates(offset=0, limit=100, timeout=0, allowed_updates=[]) {
    const form = {
        offset: offset,
        limit: limit,
        timeout: timeout,
        allowed_updates: allowed_updates
    };
    request_http("getUpdates", "POST", process_updates, form);
}
// input: json body object with @Array of Updates, also confirms that the updates have been processed
function process_updates(res) {
    const updates = res.result;
    for(let i = 0; i < updates.length; i++) {
        update_id = process_update(updates[i]);
    }
    update_id++;
    if(forever) { long_poll() };
}
// input: update object, output: id of last update object
function process_update(update) {
    const update_id = get_update_id(update);
    const player_id = get_player_id(update);
    const player_name = get_first_name(update);
    const text = get_message_text(update);
    process_text(player_id, player_name, text);
    return update_id;
}

// calls sendMessage through POST, sending a message through the bot to the user
function send_message(player_id, text) {
    const form = {
        chat_id: player_id,
        text: text
    }
    request_http("sendMessage", "POST", x => x, form);
}
// ********************************************* HTTP METHODS *****************************************************
// method: @String, callback: @function
function request_http(method, type, callback, params={}) {
    return request({
        uri: get_uri(method),
        method: type,
        form: params,
        json: true
    }, get_callback(callback));
}

// ********************************************** HELPER METHODS ***************************************************
// input: @Integer/String (user id) @String (from user), output: @String
function process_text(player_id, player_name, text) {
    const help_res = "How may I help you, " + player_name + "?";
    const default_res = "Sorry, I don't get what you're trying to say.";
    switch(text) {
            case "/help":
                send_message(player_id, help_res);
                break;
            default:
                send_message(player_id, default_res);
                break;
    }
}

function get_uri(method) {
    return "https://api.telegram.org/bot671406474:AAE_PSiJw8aESyuXN58-IRR9kH97v3SVcFE/"
        + method;
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
// UPDATE HELPER FUNCTIONS: acts on the Update object
function get_update_id(update) {
    return update.update_id;
}
function get_player_id(update) {
    return update.message.chat.id;
}
function get_message_text(update) {
    return update.message.text;
}
function get_first_name(update) {
    return update.message.chat.first_name;
}
