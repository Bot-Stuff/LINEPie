const { LINEBot } = require('../src/index');

const Bot = new LINEBot('YourTokenHere', { port: 8000 });

Bot.on('ready', () => {
	Bot.pushMessage('Channel|UserID', [{ type: 'text', text: 'Test' }]).catch(console.error);
});
