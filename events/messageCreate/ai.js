//* When messageCreate event comes, name keyword will be fired
//* is 'included'.

'use strict';
const path = require('path');
const openai = require('../../libs/openai.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const config = require('../../config.js');

const ERROR_MSG_FORMAT_TITLE = '指令格式錯誤。';
const ERROR_MSG_DESCRIPT = '\n格式為：ai <想問的問題> \n例如：ai 妳叫什麼名字？';
const ERROR_MSG_FORMAT = ERROR_MSG_FORMAT_TITLE + ERROR_MSG_DESCRIPT;

module.exports = async (message, client, handler) => {
	const msgAry = message.content.split(/ +/);
	const triggerName = path.basename(__filename).split('.')[0];

	if (!config.ai_cmd_permission_channels.includes(message.channel.id)) return;

	if (!message.author.bot && msgAry[0] === triggerName) {
        const ask = msgAry[1];
		if (!ask) {
			fmlog('error_msg', ['ai', ERROR_MSG_FORMAT_TITLE, message.content]);
			message.reply(ERROR_MSG_FORMAT);
			return;
		}
		await message.channel.sendTyping();
		const resp = await openai.response(message, 'gpt35');
		fmlog('sys_msg', [String(message.author.username) + '-' + ask, resp.content]);
		message.reply(resp.content);
	}
};
