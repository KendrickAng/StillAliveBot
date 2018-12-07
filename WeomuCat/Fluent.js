/*

WeomuCat

This kind of design is called a fluent interface:
https://en.wikipedia.org/wiki/Fluent_interface

 */

const request = require("request");

// Main class with static methods.
class Bot {
	static getUrl(method) {
		const token = "671406474:AAE_PSiJw8aESyuXN58-IRR9kH97v3SVcFE";
		return "https://api.telegram.org/bot" + token + "/" + method;
	}
	static post(method, callback) {
		request.post(Bot.getUrl(method), callback());
	}
	static postForm(method, form, callback) {
		request.post({
			"url" : Bot.getUrl(method),
			"form" : form
		}, callback());
	}
	static getMe() {
		return new getMeClass();
	}
	static getUpdates(json) {
		return new getUpdatesClass(json);
	}
	static sendMessage(json) {
		return new sendMessageClass(json);
	}
}

// Methods
class getMeClass {
	constructor() {
		this._success = () => undefined;
		this._error = () => undefined;
		const callback = () => {
			return (err, res, body) => {
				if (err) {
					this._error(err);
				}
				const response = new ResponseClass(JSON.parse(body));
				if (response.ok) {
					this._success(response.result, this);
				} else {
					this._error(response.description, this);
				}
			}
		}
		Bot.post("getMe", callback);
		return this;
	}
	success(_success) {
		this._success = _success;
		return this;
	}
	error(_error) {
		this._error = _error;
		return this;
	}
}

class getUpdatesClass {
	constructor(json = {}) {
		this._offset = json["offset"] ? json["offset"] : 0;
		this._limit = json["limit"] ? json["limit"] : 100;
		this._timeout = json["timeout"] ? json["timeout"] : 0;
		this._allowed_updates = json["allowed_updates"] ? json["allowed_updates"] : [];
		this._success = () => undefined;
		this._error = () => undefined;
		this._forever = false;
		this.post();
	}
	post() {
		const form = {
			"offset" : this._offset,
			"limit" : this._limit,
			"timeout" : this._timeout,
			"allowed_updates" : this._allowed_updates
		}
		const callback = () => {
			return (err, res, body) => {
				if (err) {
					this._error(err);
				}
				const response = new ResponseClass(JSON.parse(body));
				if (response.ok) {
					const updates = response.result.map(x => new UpdateClass(x));
					this._success(updates, this);
				} else {
					this._error(response.description, this);
				}
				if (this._forever) {
					this.post();
				}
			}
		}
		Bot.postForm("getUpdates", form, callback);
	}
	forever() {
		this._forever = true;
	}
	success(_success) {
		this._success = _success;
		return this;
	}
	error(_error) {
		this._error = _error;
		return this;
	}
}

class sendMessageClass {
	constructor(json = {}) {
		this._chat_id = json["chat_id"];
		this._text = json["text"];
		this._parse_mode = json["parse_mode"] ? json["parse_mode"] : "";
		this._disable_web_page_preview = json["disable_web_page_preview"] ? json["disable_web_page_preview"] : false;
		this._disable_notification = json["disable_notification"] ? json["disable_notification"] : false;
		this._reply_to_message_id = json["reply_to_message_id"] ? json["reply_to_message_id"] : 0;
		this._reply_markup = json["reply_markup"] ? json["reply_markup"] : {};
		this._success = () => undefined;
		this._error = () => undefined;
		const form = {
			"chat_id" : this._chat_id,
			"text" : this._text,
			"parse_mode" : this._parse_mode,
			"disable_web_page_preview" : this._disable_web_page_preview,
			"disable_notification" : this._disable_notification,
			"reply_to_message_id" : this._reply_to_message_id,
			"reply_markup" : this._reply_markup
		}
		const callback = () => {
			return (err, res, body) => {
				if (err) {
					this._error(err);
				}
				const response = new ResponseClass(JSON.parse(body));
				if (response.ok) {
					this._success(new MessageClass(response.result), this);
				} else {
					this._error(response.description, this);
				}
			}
		}
		Bot.postForm("sendMessage", form, callback);
	}
	success(_success) {
		this._success = _success;
		return this;
	}
	error(_error) {
		this._error = _error;
		return this;
	}
}

// Classes
class ResponseClass {
	constructor(json) {
		this._ok = json["ok"];
		this._result = json["result"];
		this._description = json["description"];
	}
	get ok() {
		return this._ok;
	}
	get result() {
		return this._result;
	}
	get description() {
		return this._description;
	}
}

class UpdateClass {
	constructor(json) {
		this._update_id = json["update_id"];
		this._message = json["message"] ? new MessageClass(json["message"]) : undefined;
	}
	get update_id() {
		return this._update_id;
	}
	get message() {
		return this._message;
	}
}

class MessageClass {
	constructor(json) {
		this._from = json["from"] ? new UserClass(json["from"]) : undefined;
		this._text = json["text"];
	}
	get from() {
		return this._from;
	}
	get text() {
		return this._text;
	}
}

class UserClass {
	constructor(json) {
		this._id = json["id"];
		this._first_name = json["first_name"];
	}
	get id() {
		return this._id;
	}
	get first_name() {
		return this._first_name;
	}
}

/*

// Example Usage

Bot.getMe()
	.success(json => console.log(json))
	.error(err => console.error(err));

Bot.getUpdates()
	.success(updates => console.log(updates))
	.forever();

Bot.sendMessage({
	"chat_id" : 655832423,
	"text" : "Hello World!"
})
	.success(message => console.log(message));

*/

// Example script which replies to /hello
Bot.getUpdates({
	"timeout" : 10
}).success(function(updates, bot) {
	updates.forEach(function(update) {
		if (update.message) {
			const message = update.message;
			if (message.from && message.text === "/hello") {
				const user = message.from;
				Bot.sendMessage({
					"chat_id" : user.id,
					"text" : "Hello, " + user.first_name + " :)"
				});
			}
		}
		bot._offset = ++update.update_id;
	});
}).forever();

