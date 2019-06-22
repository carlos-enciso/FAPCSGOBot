import { FAP_CS_BOT } from '../constants';
const { Client } = require('discord.js');
const bot = new Client();

bot.on('ready', () => {
	bot.user.setStatus('dnd');
	bot.user.setPresence({
		game: {
			type: 'MONITORING',
			name: '	Your every thought'
		}
	});
	console.log('I am ready!');
});

bot.login(FAP_CS_BOT.TOKEN);