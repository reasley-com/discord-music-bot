const ytdl = require("ytdl-core-discord")
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

export async function play(msg, queue) {
    const args     = msg.content.split(" ")
    const songInfo = await ytdl.getInfo(args[1]);
    const song     = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };
    

    const serverQueue = queue.get(msg.guild.id)
    
    if (!serverQueue) {
        const queueContruct = {
            textChannel:  msg.channel,
            voiceChannel: msg.member.voice.channelId,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueContruct);
        queueContruct.songs.push(song);

        const connection = channelConnect(msg)
        queueContruct.connection = connection
        playExecute(msg, queueContruct, queue)
    } else {
        serverQueue.songs.push(song);
        return msg.reply(`:arrow_forward:  ${song.title} has been added to the queue!`)
    }
}

export async function exit(msg) {
    const connection = channelConnect(msg)

    connection.on(VoiceConnectionStatus.Ready, () => {
        connection.destroy()
    });
}

async function playExecute(msg, queue) {
    const serverQueue = queue.get(msg.guild.id)

    const stream = await ytdl(serverQueue.songs[0].url, { filter: 'audioonly', quality: 'lowest', format: 'mp3', hightWaterMark: 1<<25 })

    // Pause to no subscriber in channle
    var resource = createAudioResource(stream)
    const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } })
    player.play(resource)
    serverQueue.connection.subscribe(player)
    player.on(AudioPlayerStatus.Idle, async () => {
        if (serverQueue.songs.length == 1){
            await msg.reply(`:arrow_forward:  Not Playing List`)
            queue.delete(msg.guild.id);
            serverQueue.connection.destroy()
            return
        }
        serverQueue.songs.shift()
        playExecute(msg, queue)
    });

    await msg.reply(`:arrow_forward:  Now Playing *** ${queueContruct.songs[0].title} ***`)
}

function channelConnect(msg) {
    return joinVoiceChannel({
        channelId: msg.member.voice.channelId,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator
    });
}