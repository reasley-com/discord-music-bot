import { sleep } from './functions/sleep.js'
//import { play, exit } from './functions/music.js'
import { play } from './functions/play.js'
import { exit } from './functions/exit.js'
import { Client, Intents, MessageEmbed } from 'discord.js'
import { prefix, token, t_token } from './config.json'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity('개발', { type: 'WATCHING' })
})

client.on('messageCreate', msg => {
    // Prefix & Bot message check
    if (!msg.content.startsWith(prefix) || msg.author.bot) return

    const queue = new Map();

    // Play
    if (msg.content.startsWith(`${prefix}play`) || msg.content.startsWith(`${prefix}p`)) {
        play(msg, queue)
        return
    }

    if (msg.content.startsWith(`${prefix}exit`) || msg.content.startsWith(`${prefix}e`)) {
        exit(msg, queue)
        return
    }

    msg.reply(`${msg.content}에 관한 명령어를 찾을 수 없습니다.`)
})

client.login(t_token)