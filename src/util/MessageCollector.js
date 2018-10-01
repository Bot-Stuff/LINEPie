module.exports = class extends require('./EventEmitter') {
	constructor(Bot, filter, { time, max } = {}) {
		super();

		this.collected = [];
		this.filter = filter;

		Bot.on('message', this.handle.bind(this));
		if (time) this.timeout = setTimeout(this.stop.bind(this), time);
		this.maxLimit = max || 1;
	}

	handle(message) {
		if (this.filter(message)) {
			this.emit('collect', message);
			this.collected.push(message);
			if (this.collected.length === this.maxLimit) return this.stop();
		}
	}

	stop() {
		if (this.timeout) clearTimeout(this.timeout);
		this.emit('end', this.collected);
		this.removeListener('message', this.handle);
	}
};
