import { sleep } from './functions/sleep.js'
//import { play, exit } from './functions/music.js'
import play from './functions/play.js'
import exit from './functions/exit.js'
import help from './functions/help.js'
import { Client, Intents, MessageEmbed } from 'discord.js'
import { prefix, token, t_token } from './config.json'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })
const queue = new Map();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity(`Music Bot | ${prefix}help`, { type: 'LISTENING' })
})

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

    // Exit
    if (msg.content.startsWith(`${prefix}exit`) || msg.content.startsWith(`${prefix}e`)) {
        exit(msg, queue)
        return
    }

    const embed = new MessageEmbed().setTitle('Music status').setDescription(`No commands were found for ${msg.content}.`)
    msg.channel.send({embeds: [embed]})
})

client.login(token)