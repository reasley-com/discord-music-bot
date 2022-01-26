const ytdl = require("ytdl-core-discord")
import { channelConnect } from './channelConnect.js'
import { MessageEmbed } from 'discord.js'
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

const emoji = [ '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ]

export async function play(msg, queue) {
    // queue data get
    const serverQueue = queue.get(msg.guild.id)

    // music data get & assort
    const args = msg.content.split(" ")
    let songAsso = {
        title: '',
        url: '',
    }

    try {
        const songInfo = await ytdl.getInfo(args[1]);
        songAsso = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        }
    } catch (err) {
        msg.channel.send(`:arrow_forward:  Link Error`)
        return
    }

    // server queue check
    // 이미 동작중인 서버에서 요청한 명령어인지 확인
    if ( !serverQueue ) {
        // connect channel & default server data record
        const connection = channelConnect(msg)
        const queueContruct = { connection: connection, songs: [songAsso] };
        queue.set(msg.guild.id, queueContruct)
        await playExecute(msg, queue, 'play')
    } else {
        // new song insert play list
        serverQueue.songs.push(songAsso)


        // 임베디드 메세지 생성
        const embed = new MessageEmbed()

        // 재생목록 작성
        let songList = []

        // 등록된 곡이 1개일 경우 > 플레이 중인 곡만 출력
        // 큐에서 노래 삭제는 노래 종료 후 삭제되므로 length가 0일 경우에는 continue
        if (serverQueue.songs.length == 1){
            embed
            .setTitle('Music status')
            .setDescription(`:arrow_forward:  Now Playing *** ${serverQueue.songs[0].title} ***`)
        } else { // 등록된 곡이 2개 이상일 경우 > 현재 재생 목록 출력
            while ( serverQueue.songs.length != songList.length && songList.length < 10 ) {
                if ( songList.length == 0 ) {
                    songList.push('\n')
                    continue
                }
                songList.push(emoji[songList.length] + ' : ' + serverQueue.songs[songList.length].title + '\n')
            }
            embed
            .setTitle('Music status')
            .setDescription(`:arrow_forward:  Now Playing *** ${serverQueue.songs[0].title} ***
            :arrow_forward:  Add Play *** ${serverQueue.songs[serverQueue.songs.length-1].title} ***

            ${songList.join(' ')}
            `)
        }
        await msg.channel.send({embeds: [embed]})
    }
}

export async function playExecute(msg, queue) {
    let serverQueue = queue.get(msg.guild.id)

    // get ytdl
    const stream = await ytdl(serverQueue.songs[0].url, { filter: 'audioonly', quality: 'lowest', format: 'mp3', hightWaterMark: 1<<25 })

    // Pause to no subscriber in channle
    var resource = createAudioResource(stream, { inlineVolume: true })
    resource.volume.setVolume(0.05)
    const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } })
    player.play(resource)
    serverQueue.connection.subscribe(player)

    // Next play list
    // 재생 중이던 음악이 끝날때 까지 대기
    player.on(AudioPlayerStatus.Idle, async () => {
        // 재생 중이던 음악 삭제 & 다음 곡이 없다면 봇 정리
        if (serverQueue.songs.length == 1){
            const embed = new MessageEmbed()
                .setTitle('Music status')
                .setDescription(`:arrow_forward:  Not Playing List`)

            await msg.channel.send({embeds: [embed]})
            
            queue.delete(msg.guild.id);
            serverQueue.connection.destroy()
            return
        }

        // 다음곡으로 넘김
        serverQueue.songs.shift()
        await playExecute(msg, queue)
    });

    
    // 현재 재생중인 안내 메세지
    const embed = new MessageEmbed()
        .setTitle('Music status')
        .setDescription(`:arrow_forward:  Now Playing *** ${serverQueue.songs[0].title} ***
        :arrow_forward: The number of songs left :: ${serverQueue.songs.length - 1}`)

    await msg.channel.send({embeds: [embed]})
}