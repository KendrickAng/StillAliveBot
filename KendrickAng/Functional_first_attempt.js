/*
GOAL: write function long_poll that takes
    1. unary function that does something to the (JSON) output
    2. message to send to the person communicating with the bot.
FUNCTIONS:
- getUpdates
- sendMessage
get the url, post the url with request (returning a promise)
*/

//TODO: Shorten the logic code. Could use a dict to store and retrieve messages.

const request = require('request');
let update_id = 0;
let forever = true;
let help_requested = false;

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
function send_message(player_id, text, keyboard={}) {
    const form = {
        chat_id: player_id,
        text: text,
        reply_markup: JSON.stringify(keyboard)
    };
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
    const help_res = "Hello " + player_name + ", on a scale from 1 (insane) to 9 (I'm fine), what's your sanity level?";
    const default_res = "Sorry, I don't get what you're trying to say.";
    const start_res = "Welcome! Things are still being setup here, so we can't accommodate you yet. Why don't you take a look around first?" +
                       "\n" + "Type /help to get a list of commands."
        if(help_requested) {
            switch(text) {
                case "1":
                    send_message(player_id, "You should seek professional help. But first, have a :)");
                    help_requested = false;
                    break;
                case "9":
                    send_message(player_id, "I'm glad you're doing fine! Hope to see you again ;)");
                    help_requested = false;
                    break;
                default:
                    send_message(player_id, "All the best.");
                    help_requested = false;
                    break;
            }
        } else {
            switch(text) {
                case "/help":
                    help_requested = true;
                    const keyboard = make_keyboard([["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]]);
                    send_message(player_id, help_res, keyboard);
                    break;
                case "/start":
                    send_message(player_id, start_res);
                    break;
                default:
                    send_message(player_id, default_res);
                    break;
        }

    }
}

// input: @Array of Array of String, output: ReplyKeyBoardMarkup object
function make_keyboard(arr) {
    if(arr === []) return [];
    const height = arr.length;
    const width = arr[0].length;
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            arr[i][j] = make_keyboard_button(arr[i][j]);
        }
    }
    const keyboard = {
        keyboard: arr,
        one_time_keyboard: true
    };
    return keyboard;
}
function make_keyboard_button(str) {
    return {
        text: str
    };
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
