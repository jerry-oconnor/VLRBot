const { Client, Collection, MessageEmbed, Intents } = require('discord.js');

const axios = require('axios'); // for api calls 

// constants 
const DEF_THUMBN = 'https://www.vlr.gg/img/vlr/logo_header.png'
const NUM_MATCHES = 5; 

module.exports = {
    name : 'results', 
    description : 'shows completed matches as rich embeds',

    async execute(message,rawCommand) { // command execution 

        // vlrggapi call 
        let getResults = async() => 
        {
            let response = await axios.get('https://vlrggapi.herokuapp.com/match/results');
            let results = response.data; 
            return results; 
        }
        let results = await getResults();

        // build embeds array and send 
        embeds = [];
        for (i = 0; i < NUM_MATCHES; i++)
        {
            const embed = new MessageEmbed(); 
                embed.setColor('#f85463'); // vlr.gg red 
                embed.setTitle(`${results.data.segments[i].team1} :${results.data.segments[i].flag1}: vs ${results.data.segments[i].team2} :${results.data.segments[i].flag2}:`);
                embed.setURL(`https://www.vlr.gg${results.data.segments[i].match_page}`);
                embed.setAuthor(`${results.data.segments[i].tournament_name} · ${results.data.segments[i].round_info}`);
                embed.setDescription(`**[${results.data.segments[i].score1} - ${results.data.segments[i].score2}]** · ${results.data.segments[i].time_completed}`);

                if (results.data.segments[i].tournament_icon === 'https:/img/vlr/tmp/vlr.png'){ // invalid thumbnail 
                    embed.setThumbnail(DEF_THUMBN);
                } else embed.setThumbnail(results.data.segments[i].tournament_icon);
                
            embeds[i] = embed; 
        }
        message.channel.send({embeds});
    }
}