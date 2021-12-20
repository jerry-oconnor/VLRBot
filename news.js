const { Client, Collection, MessageEmbed, Intents } = require('discord.js');

const axios = require('axios'); // for api calls 

// constants 
const NUM_STORIES = 4;
const DEF_THUMBN = 'https://www.vlr.gg/img/vlr/logo_header.png'

module.exports = {
    name : 'news', 
    description : 'shows top news stories ',

    async execute(message,rawCommand) { // command execution 

         // vlrggapi call 
         let getNews = async function() 
         {
             let response = await axios.get('https://vlrggapi.herokuapp.com/news');
             return response.data; 
         }
         let news = await getNews(); 
 
         // generate embeds for top stories and send to channel 
         embeds = []; 
         for (i = 0; i < NUM_STORIES; i++)
         {
             const embed = new MessageEmbed();
                 embed.setColor('#f85463') // vlr.gg red 
                 embed.setTitle(news.data.segments[i].title)
                 embed.setURL(`https://www.vlr.gg${news.data.segments[i].url_path}`)
                 embed.setAuthor(`${news.data.segments[i].author} · ${news.data.segments[i].date}`)
                 embed.setDescription(news.data.segments[i].description)
                 embed.setThumbnail(DEF_THUMBN);
             embeds[i] = embed;
         }
         message.channel.send({embeds});
    }
}