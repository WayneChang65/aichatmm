'use strict';
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const config = require('./config.js');
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent
	],
});

new CommandHandler({
	client,
	commandsPath: path.join(__dirname, 'commands'),
	eventsPath: path.join(__dirname, 'events'),
	validationsPath: path.join(__dirname, 'validations'),
	//testServer: config.testGuildId,
});

client.login(config.botToken);