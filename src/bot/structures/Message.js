const User = require('./User');
const MessageCollector = require('../../util/MessageCollector');

module.exports = class extends require('./Base') {
	constructor(Bot, { replyToken, source, message: { id, type, text } }) {
		super(Bot);
		this._Bot = Bot;
		this.id = id;
		this.type = type;
		this.text = text || false;
		this.replyToken = replyToken;
		this.source = source;
		this.author = new User(Bot, source.userId);
	}

	awaitMessages(options) {
		return new MessageCollector(this._Bot, onCollect => onCollect.source.type === this.source.type &&
        onCollect.source[`${this.source.type}Id`] === this.source[`${this.source.type}Id`], options);
	}

	response(messages) {
		this._Bot._requestManager.run('POST', `message/reply`, { replyToken: this.replyToken, messages });
	}

	sendMessage(messages) {
		return this._Bot.pushMessage(this.source[`${this.source.type}Id`], messages);
	}
};
