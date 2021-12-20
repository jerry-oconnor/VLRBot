const { Client, Collection, MessageEmbed, Intents } = require('discord.js');

const axios = require('axios'); // for api calls 

// constants 
const DEF_THUMBN = 'https://www.vlr.gg/img/vlr/logo_header.png'
const NUM_MATCHES = 5; 

module.exports = {
    name : 'upcoming', 
    description : 'shows upcoming matches as rich embeds',

    async execute(message,rawCommand) { // command execution 

        // vlrggapi call 
        let getUpcoming = async() => 
        {
            let response = await axios.get('https://vlrggapi.herokuapp.com/match/upcoming');
            let upcoming = response.data; 
            return upcoming; 
        }
        let upcoming = await getUpcoming();

        // build embeds array and send 
        embeds = [];
        for (i = 0; i < NUM_MATCHES; i++)
        {
            const embed = new MessageEmbed(); 
                embed.setColor('#f85463'); // vlr.gg red 
                embed.setTitle(`${upcoming.data.segments[i].team1} :${upcoming.data.segments[i].flag1}: vs ${upcoming.data.segments[i].team2} :${upcoming.data.segments[i].flag2}:`);
                embed.setURL(`https://www.vlr.gg${upcoming.data.segments[i].match_page}`);
                embed.setAuthor(`${upcoming.data.segments[i].tournament_name} · ${upcoming.data.segments[i].round_info}`);
                embed.setDescription(upcoming.data.segments[i].time_until_match === 'TBD' ? 'Live!' : upcoming.data.segments[i].time_until_match);

                if (upcoming.data.segments[i].tournament_icon === 'https:/img/vlr/tmp/vlr.png'){ // invalid thumbnail 
                    embed.setThumbnail(DEF_THUMBN);
                } else embed.setThumbnail(upcoming.data.segments[i].tournament_icon);
                
            embeds[i] = embed; 
        }
        message.channel.send({embeds});
        message.channel.send(':eyes: !watchparty to create watchparty event :eyes:')
    }
}