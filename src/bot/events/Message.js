const MessageCollector = require('../../util/MessageCollector');

module.exports = class {
	constructor(Bot) {
		this.Bot = Bot;
	}

	async run({ replyToken, source, message: { id, type, text } }) {
		this.Bot.emit('message', {
			id,
			type,
			text,
			source,
			response: (messages) => this.Bot._requestManager.run('POST', `message/reply`, { replyToken, messages }),
			awaitMessages: (options) => new MessageCollector(this.Bot, onCollect => onCollect.source.type === this.source.type &&
				onCollect.source[`${this.source.type}Id`] === this.source[`${this.source.type}Id`], options)
		});
	}
};
