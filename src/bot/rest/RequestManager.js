const { request: HTTPSRequest } = require('https');
const { PassThrough } = require('stream');
const { stringify: stringifyJSON, parse: parseJSON } = JSON;
const { byteLength } = Buffer;
const { assign: objectAssign } = Object;

const { hostname, path, headers } = require('../constants');

module.exports = class {
	constructor(channelAccessToken) {
		this.options = {
			hostname,
			headers: objectAssign({ Authorization: `Bearer ${channelAccessToken}` }, headers)
		};
	}

	run(method, endpoint, body) {
		return new Promise((resolve, reject) => {
			const options =	objectAssign({ method, path: `${path}/${endpoint}` }, this.options);

			if (body) {
				body = stringifyJSON(body);
				options.headers['Content-Length'] = String(byteLength(body));
			}
			
			const request = HTTPSRequest(options, response => {
				const responseBody = response.pipe(PassThrough());
				let returnBody = '';
				responseBody.on('data', data => returnBody += data);
				responseBody.on('end', () => response.statusCode === 200 ? resolve(parseJSON(returnBody)) : reject(parseJSON(returnBody)));
				response.on('error', reject);
			});

			request.on('error', reject);
			if (body) request.write(body);
			request.end();
		});
	}
};
