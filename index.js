//Requirements
require('dotenv').config();
const { GatewayIntentBits, Client, Collection, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

global.canread = false;

//Initialize clients and AI config
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

//------------------------------------------------------\\


//Commands
client.commands = new Collection();
//Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
//Commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//------------------------------------------------------\\

const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});


const openai = new OpenAIApi(configuration);

//check for message
client.on('messageCreate', async function(message){
    if(canread){
        try{
            //ignores bot-sent messages
            if(message.author.bot) return;

            const GPTResponse = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `ChatGPT is a friendly chatbot.\n\
                ChatGPT: Hello, how are you?\n\
                ${message.author.username}: ${message.content}\n\
                ChatGPT:`,
                temperature: 1.5,
                max_tokens: 500,
                stop: ["ChatGPT:", "SirAndrew:"],
            })

            message.reply(`${GPTResponse.data.choices[0].text}`);
            return;
        } catch(err){
            console.log(err)
        }
    }
    else{
        return;
    }
});

//log in the bot into the server
client.login(process.env.DISCORD_TOKEN);
console.log("Bot is Online on Discord")