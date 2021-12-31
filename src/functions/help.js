import { MessageEmbed } from 'discord.js'

async function help(msg, prefix) {
    const embed = new MessageEmbed()
        .setTitle('Music status')
        .setDescription(`:arrow_forward:  ${prefix}help or ${prefix}h                :: Help output.
        :arrow_forward:  ${prefix}play {Youtube Link} or ${prefix}p {Youtube Link}   :: Play the song.
        :arrow_forward:  ${prefix}exit or ${prefix}e                                 :: Exit channel
        `)
    
    await msg.channel.send({embeds: [embed]})
}

export default help