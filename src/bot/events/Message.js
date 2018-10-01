const Extender = require('../../util/Extender');

const Message = Extender.get('Message');

module.exports = class {
	constructor(Bot) {
		this.Bot = Bot;
	}

	async run(message) {
		this.Bot.emit('message', new Message(this.Bot, message));
	}
};
