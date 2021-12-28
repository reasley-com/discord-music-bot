const ytdl = require("ytdl-core-discord")
import { channelConnect } from './channelConnect.js'
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

export async function play(msg, queue) {
    // queue data get
    const serverQueue = queue.get(msg.guild.id)

    // music data get & assort
    try {
        const args = msg.content.split(" ")
        const songInfo = await ytdl.getInfo(args[1]);
        const songAsso = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        }
    } catch (err) {
        msg.reply(`:arrow_forward:  Link Error`)
        return
    }
    const args = msg.content.split(" ")
    const songInfo = await ytdl.getInfo(args[1]);
    const songAsso = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    }
    


    // server queue check
    // 이미 동작중인 서버에서 요청한 명령어인지 확인
    if ( !serverQueue ) {
        // connect channel & default server data record
        const connection = channelConnect(msg)
        const queueContruct = { connection: connection, songs: [songAsso] };
        queue.set(msg.guild.id, queueContruct)
        playExecute(msg, queue)
    } else {
        // new song insert play list
        serverQueue.songs.push(songAsso)
        msg.reply(`:arrow_forward:  ${songAsso.title} has been added to the queue!`)
    }
}

async function playExecute(msg, queue) {
    const serverQueue = queue.get(msg.guild.id);

    // get ytdl
    const stream = await ytdl(serverQueue.songs[0].url, { filter: 'audioonly', quality: 'lowest', format: 'mp3', hightWaterMark: 1<<25 })

    // Pause to no subscriber in channle
    var resource = createAudioResource(stream)
    const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } })
    player.play(resource)
    serverQueue.connection.subscribe(player)

    // Next play list
    // 재생 중이던 음악이 끝날때 까지 대기
    player.on(AudioPlayerStatus.Idle, async () => {
        // 재생 중이던 음악 삭제 & 다음 곡이 없다면 봇 정리
        if (serverQueue.songs.length == 1){
            await msg.reply(`:arrow_forward:  Not Playing List`)
            queue.delete(msg.guild.id);
            serverQueue.connection.destroy()
            return
        }

        // 다음곡으로 넘김
        serverQueue.songs.shift()
        playExecute(msg)
    });
    await msg.reply(`:arrow_forward:  Now Playing *** ${serverQueue.songs[0].title} ***`)
}
