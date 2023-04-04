//* When messageCreate event comes, name keyword will be fired
//* is 'included'.

'use strict';
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../../config.js');

module.exports = async (message, client, handler) => {
	const msgAry = message.content.split(/ +/);
	const triggerName = path.basename(__filename).split('.')[0];

	if (!message.author.bot && msgAry[0] === triggerName) {
        // Developer Only Check
        if (message.author.id !== config.developerId) {
            const msg = `This command is for the developer only! (${triggerName})`;
            message.reply(msg);
            console.log(msg);
            return;
        }

		try {
			const rest = new REST({ version: '9' }).setToken(config.botToken);
			console.log('Purging...');
			await rest.put(
				//! 以下兩行程式，只能 2 選 1 (一塊用會有錯誤訊息)。
				//* 上面是清除 testServerId 的 slash commands
				//* 下面是清除 global 的 slash commands
				Routes.applicationGuildCommands(config.botId, config.testGuildId),
				//Routes.applicationCommands(config.botId),

				{ body: [] }
			);
			const successMsg = 'Successfully purge all slash commands!';
			console.log(successMsg);
			message.reply(successMsg);
		} catch (error) {
			console.error(error);
		}
	}
};
