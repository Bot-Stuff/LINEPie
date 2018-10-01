const { readdirSync: readDirectory } = require('fs');

module.exports = class extends require('../util/EventEmitter') {
	constructor(channelAccessToken, { port } = {}) {
		super();
		if (typeof channelAccessToken !== 'string') throw new TypeError('You need to pass ChannelAccessToken as String');
		this._port = port || 8000;
		this._requestManager = new (require('./rest/RequestManager'))(channelAccessToken);
		this._events = {};
		this.extenders = require('../../util/Extender');

		for (const fileName of readDirectory(`${__dirname}\\events`)) this._events[fileName.replace(/\..*/, '').replace(/^\w/, character => character.toLowerCase())] = new (require(`./events/${fileName}`))(this);
		new (require('./rest/Server'))()
			.on('data', ({ events }) => {
				for (const event of events) this._events[event.type].run(event);
			})
			.on('error', (error) => console.log(`\u001b[41mLINEPie ${new Date().toLocaleString()}\u001b[49m ${error}`))
			.on('close', (reason) => console.log(`\u001b[41mLINEPie ${new Date().toLocaleString()}\u001b[49m ${reason}`))
			.start(this._port).then(serverPort => {
				console.info(`\u001b[44mLINEPie ${new Date().toLocaleString()}\u001b[49m \u001b[mAPI started on localhost:${serverPort}\u001b[m`);
				this.emit('ready');
			})
			.catch(console.error);
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
