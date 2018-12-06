// WeomuCat
const request = require("request");
const token = "671406474:AAE_PSiJw8aESyuXN58-IRR9kH97v3SVcFE";

function methodUrl(method) {
	return "https://api.telegram.org/bot" + token + "/" + method;
}

function requestCallBack(callback) {
	return (error, response, body) => {
		callback(JSON.parse(body));
	}
}

function requestPost(callback, method) {
	request.post(methodUrl(method), requestCallBack(callback));
}

function requestPostForm(callback, method, form) {
	request.post({
		"url" : methodUrl(method),
		"form" : form
	}, requestCallBack(callback));
}

function getMe(callback) {
	requestPost(callback, "getMe");
}

function getUpdates(callback, offset, limit=100, timeout=0, allowed_updates=[]) {
	const form = {
		"offset" : offset,
		"limit" : limit,
		"timeout" : timeout,
		"allowed_updates" : allowed_updates
	}
	const result = requestPostForm(callback, "getUpdates", form);	
}

function sendMessage(callback, chat_id, text) {
	const form = {
		"chat_id" : chat_id,
		"text" : text
	}
	const result = requestPostForm(callback, "sendMessage", form);
}

// getMe(json => console.log(json));
getUpdates(json => console.log(json));
// sendMessage(json => console.log(json), 108255672, "Hello World!");
// sendMessage(json => console.log(json), 655832423, "Hello World!");

