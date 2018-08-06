const { Server } = require('http');
const { createInflate, createGunzip } = require('zlib');

const { parse: parseJSON } = JSON;

module.exports = class extends Server {
	constructor() {
		super();
		this.on('request', this.handleRequest.bind(this));
	}

	start(port) {
		return new Promise((resolve, reject) => this.listen(port, error => error ? reject(error) : resolve(port)));
	}

	handleRequest(request) {
		if (request.method !== 'POST') return;
		try {
			let stream;
			switch ((request.headers['content-encoding'] || 'IDENTITY').toUpperCase()) {
				case 'IDENTITY':
					stream = request;
					stream.length = request.headers['content-length'];
					break;
				case 'DEFLATE':
					stream = createInflate();
					request.pipe(stream);
					break;
				case 'GZIP':
					stream = createGunzip();
					request.pipe(stream);
					break;
				default: return;
			}

			let body = '';
			stream.on('data', chunk => body += chunk);
			stream.on('end', () => {
				try {
					this.emit('data', parseJSON(body));
				} catch (error) {
					this.emit('error', `Can't parse data, ${body}`);
				}
			});
		} catch (error) {
			this.emit('error', error);
		}
	}
};
