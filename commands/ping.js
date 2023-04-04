'use strict';
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Bot status.'),

	run: ({ interaction, client, handler }) => {
		interaction.reply(
			`Online since ${client.readyAt}. ${client.ws.ping}ms`
		);
	},
	//devOnly: true,
};
