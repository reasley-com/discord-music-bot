import { Client, Intents, MessageEmbed } from 'discord.js'
const { VoiceConnectionStatus } = require('@discordjs/voice');


import { play } from './functions/play.js'
import skip from './functions/skip.js'
import help from './functions/help.js'
import exit from './functions/exit.js'
import { sleep } from './functions/sleep.js'

import { prefix, token, t_token } from './config.json'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })
const queue = new Map();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity(`Music Bot | ${prefix}help`, { type: 'LISTENING' })
})


// 봇 강제 연결 해제 시 후처리
client.on('voiceStateUpdate', msg => {
    const serverQueue = queue.get(msg.guild.id)

    if ( serverQueue ) {
        serverQueue.connection.on(VoiceConnectionStatus.Disconnected, () => {
            queue.delete(msg.guild.id)
        });
    }
});

client.on('messageCreate', msg => {
    // Prefix & Bot message check
    if (!msg.content.startsWith(prefix) || msg.author.bot) return

    // Play
    if (msg.content.startsWith(`${prefix}help`) || msg.content.startsWith(`${prefix}h`)) {
        help(msg, prefix)
        return
    }

    // Play
    if (msg.content.startsWith(`${prefix}play`) || msg.content.startsWith(`${prefix}p`)) {
        play(msg, queue)
        return
    }

    // Skip
    if (msg.content.startsWith(`${prefix}skip`) || msg.content.startsWith(`${prefix}s`)) {
        skip(msg, queue)
        return
    }

    // Exit
    if (msg.content.startsWith(`${prefix}exit`) || msg.content.startsWith(`${prefix}e`)) {
        exit(msg, queue)
        return
    }

    const embed = new MessageEmbed().setTitle('Music status').setDescription(`No commands were found for ${msg.content}.`)
    msg.channel.send({embeds: [embed]})
})

client.login(token)