const { LINEBot } = require('../src/index');

const Bot = new LINEBot('YourToken', { port: 8000, fetchUserOnMessage: true });

Bot.on('message', message => {
	if (message.text === 'Ping') message.response([{ type: 'text', text: 'Pong' }]);
});
