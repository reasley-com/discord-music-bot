const { joinVoiceChannel } = require('@discordjs/voice');

export function channelConnect(msg) {
    return joinVoiceChannel({
        channelId: msg.member.voice.channelId,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator
    })
}