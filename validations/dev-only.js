'use strict';
const config = require('../config.js');

module.exports = (interaction, commandObj, handler, client) => {
	if (commandObj.devOnly) {
		if (interaction.member.id !== config.developerId) {
			interaction.reply('This command is for the developer only');
			return true;
		}
	}
};
