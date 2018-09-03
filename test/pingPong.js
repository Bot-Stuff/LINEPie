const { LINEBot } = require('../src/index');

const Bot = new LINEBot('YourTokenHere', { port: 8000 });

Bot.on('message', message => {
	if (message.text === 'Ping') message.response([{ type: 'text', text: 'Pong' }]);
});
