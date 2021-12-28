import sleep from './functions/sleep.js'
import { play } from './functions/music.js'
import { Client, Intents } from 'discord.js'
import { prefix, token } from './config.json'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity('개발', { type: 'WATCHING' })
})

client.on('messageCreate', async msg => {
    // Prefix & Bot message check
    if (!msg.content.startsWith(prefix) || msg.author.bot) return


    // Play
    if (msg.content.startsWith(`${prefix}play`)) {
        play(msg)
    }
})

client.login(token)