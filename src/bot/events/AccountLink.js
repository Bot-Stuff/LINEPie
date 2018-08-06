module.exports = class {
	constructor(Bot) {
		this.Bot = Bot;
	}

	async run(data) {
		this.Bot.emit('accountLnk', data);
	}
};
