let axios = require('axios');
let update_id = 0;
const api = "https://api.telegram.org/bot671406474:AAE_PSiJw8aESyuXN58-IRR9kH97v3SVcFE/";

// listen for updates
longPoll();

function longPoll() {
    getUpdates(update_id, 100, 120, ["message", "from", "text"])
                  .then(function(response) {
                      const updates = response.data.result;
                      // iterates through each update and respond accordingly
                      for(let i = 0; i < updates.length; i++) {
                          update_id = updates[i].update_id;
                          const message = get_message(updates[i]);
                          console.log(message);
                          const user = get_user(message);
                          sendMessage(user.id, user.first_name + ", did you speak to me?")
                              .then(res => console.log("message sent"))
                              .catch(error => console.log("error at sendMessage"));
                      }
                      // Must be greater by one than the highest among the identifiers of previously received updates
                      update_id++;
                      longPoll();
                  })
                  .catch(function(error) {
                      console.log(error);
                  });
}

function getUpdates(offset, limit, timeout, allowed_updates) {
    return axios.post(api + "getUpdates", {
        offset: offset,
        limit: limit,
        timeout: timeout,
        allowed_updates: allowed_updates
    });
}
// input: @Update, output: @Message
function get_message(update) {
    return update.message;
}

// input: @Message, output: @User
function get_user(message) {
    return message.from;
}

// sendMessage input: @String/@Integer, output: promise object
function sendMessage(chat_id, text) {
    return axios.post(api + "sendMessage", {
           chat_id: chat_id,
           text: text
       });
}

// getChat input: @Integer/@String, output: promise object
function getChat(chat_id) {
    return axios.post(api + "getChat", {
            chat_id: chat_id
        });
}


