module.exports = class {
	constructor(Bot) {
		this.Bot = Bot;
	}

	async run(message) {
		this.Bot.emit('message', new (this.Bot.extenders.get('Message'))(this.Bot, message));
	}
};
