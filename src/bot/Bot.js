const { readdirSync } = require('fs');
const { resolve: resolvePath } = require('path');

module.exports = class extends require('../util/EventEmitter') {
	constructor(channelAccessToken, { port, fetchUserOnMessage } = {}) {
		super();

		if (typeof channelAccessToken !== 'string') throw new TypeError('You need to pass ChannelAccessToken as String');

		this._port = port || 8000;
		this._fetchUserOnMessage = fetchUserOnMessage ? true : false;

		this._requestManager = new (require('./rest/RequestManager'))(channelAccessToken);
		this._events = {};

		for (const file of readdirSync(resolvePath(__dirname, './events'))) {
			const event = new (require(`./events/${file}`))(this);
			this._events[file.replace(/\..*/, '').replace(/^\w/, character => character.toLowerCase())] = event;
		}

		new (require('./rest/Server'))()
			.on('data', ({ events }) => {
				for (let event of events) this._events[event.type].run(event);
			})
			.start(this._port).then(port => {
				console.log(`\u001b[44mLINE.js ${Date.now()}\u001b[49m \u001b[mAPI started on localhost:${port}\u001b[m`);
				this.emit('ready');
			}).catch(console.error);
	}

	getMessageContent(id) {
		return this._requestManager.run('GET', `message/${id}/content`);
	}

	fetchUser(id) {
		return this._requestManager.run('GET', `profile/${id}`);
	}

	pushMessage(to, messages) {
		return this._requestManager.run('POST', `message/push`, { to, messages });
	}
};
