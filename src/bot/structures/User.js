module.exports = module.exports = class extends require('./Base') {
	constructor(Bot, id) {
		super(Bot);
		this._Bot = Bot;
		this.id = id;
	}

	getProfile() {
		return this._Bot.fetchUser(this.id);
	}

	sendMessage(message) {
		return this._Bot.pushMessage(this.id, message);
	}
};
