import { MessageEmbed } from 'discord.js'
import { playExecute } from './play.js'

async function skip(msg, queue) {
    const serverQueue = queue.get(msg.guild.id)

    if ( serverQueue ) {
        // 재생 중이던 음악 삭제 & 다음 곡이 없다면 봇 정리
        if (serverQueue.songs.length == 1){
            await msg.reply(`:arrow_forward:  Not Playing List`)
            queue.delete(msg.guild.id)
            serverQueue.connection.destroy()
            return
        }

        // 다음곡으로 넘김
        serverQueue.songs.shift()
        await playExecute(msg, queue)
    }
}

export default skip