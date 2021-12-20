// bot.js 

require('dotenv').config(); // .env file contains login token 

// initial setup 
const axios = require('axios'); // for api calls 
const { Client, Collection, MessageEmbed, Intents } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] }); // channel intents 

const fs = require ('fs'); // filesystem 
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // only JS files 

for (const file of commandFiles )
{
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// verify successful login  
client.once('ready', () =>
{
    console.log(`logged in as ${client.user.tag}!`);
});

// listen for command 
client.on('messageCreate', async message => 
{
    // command constants 
    const prefix = '!' // command prefix ex: !today 

    // ignore non-commands and messages from other bots 
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    // parse command 
    const rawCommand = message.content.slice(prefix.length).split(/ +/);
    const command = rawCommand.shift().toLowerCase(); 

    // command logic
    if (command === 'news') {
        client.commands.get('news').execute(message,rawCommand)
    } if (command === 'upcoming') {
        client.commands.get('upcoming').execute(message,rawCommand)
    } if (command === 'results') {
        client.commands.get('results').execute(message,rawCommand)
    }
});   

// connect to server using token from .env file 
client.login(process.env.DISCORD_TOKEN)