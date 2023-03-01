const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('You no longer need the Oracle\'s services'),
	async execute(interaction) {
		await interaction.reply(`The Oracle to his studies...`);
		await wait(2000);
        canread=false;
		await interaction.editReply(`Should you ever need the Oracle's wisdom again, simply beckon his services...`)
	},
};