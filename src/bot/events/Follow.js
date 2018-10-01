const Message = require('../structures/Message');

module.exports = class {
	constructor(Bot) {
		this.Bot = Bot;
	}

	async run(message) {
		this.Bot.emit('follow', new Message(this.Bot, message));
	}
};
