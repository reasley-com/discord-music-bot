const { VoiceConnectionStatus } = require('@discordjs/voice');
import { MessageEmbed } from 'discord.js'

async function exit(msg, queue) {
    const serverQueue = queue.get(msg.guild.id)

    const embed = new MessageEmbed()
    if ( serverQueue ){
        queue.delete(msg.guild.id);
        serverQueue.connection.destroy()

        embed
            .setTitle('Music status')
            .setDescription(`Disconnected it normally.`)
    
        await msg.channel.send({embeds: [embed]})
    } else {
        embed
        .setTitle('Music status')
        .setDescription(`Not connected to the voice chat.`)
    
        await msg.channel.send({embeds: [embed]})
    }
}

export default exit