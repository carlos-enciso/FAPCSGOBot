import { FAP_CS_BOT, CHANNELS } from '../constants';
const { Client } = require('discord.js');
const bot = new Client();

bot.on('ready', () => {
	bot.user.setStatus('dnd');
	bot.user.setPresence({
		game: {
			type: 'LISTENING',
			name: 'Your every thought'
		}
	});

	console.log('I am ready!');
});

// Create an event listener for messages
bot.on('message', message => {
	message.member.client.user.fetchProfile().then(_profile => {
		console.log('_profile: ' + JSON.stringify(_profile, null, '	'));
	});
	if (message.content === '!moveme') {
		moveToChannel(message, CHANNELS.TEAM1);
	}
	if (message.content === '!movemeback') {
		moveToChannel(message, CHANNELS.LOBBY);
	}
});

bot.login(FAP_CS_BOT.TOKEN);

const moveToChannel = (_message, _channelName) => {
	const channel = _message.guild.channels.find(_name => _name.name === _channelName);
	_message.member.setVoiceChannel(channel.id).catch(_error => {
		console.log(_error);
		if (_error.code && _error.code === 40032) {
			_message.channel.send(`Please join a voice channel and run the \`!moveme\` command${_message.author}`);
		}
	});
};