const ytdl = require("ytdl-core-discord")
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

export async function play(msg) {
    const args = msg.content.split(" ")

    try {
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        const connection = joinVoiceChannel({
            channelId: msg.member.voice.channelId,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator
        });
    
        const stream = await ytdl(song.url, { filter: 'audioonly', quality: 'lowest', format: 'mp3', hightWaterMark: 1<<25 });
        const player = createAudioPlayer()
        var resource = createAudioResource(stream)
        player.play(resource)
        connection.subscribe(player);
    
        await msg.reply(`:arrow_forward:  Now Playing *** ${song.title} ***`)

    } catch(err) {
        await msg.reply(`:arrow_forward: Wrong link`)
    }
}