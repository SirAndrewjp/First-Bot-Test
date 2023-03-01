const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('request')
		.setDescription('Request audience with the Oracle'),
	async execute(interaction) {
		await interaction.reply(`The Oracle is preparing his study...`);
        await wait(2000);
		canread=true;
		await interaction.editReply(`The Oracle is now ready for your inquiries...`)
	},
};