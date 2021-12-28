const { VoiceConnectionStatus } = require('@discordjs/voice');
import { channelConnect } from './channelConnect.js'

export async function exit(msg, queue) {
    const connection = channelConnect(msg)

    connection.on(VoiceConnectionStatus.Ready, () => {
        queue.delete(msg.guild.id);
        connection.destroy()
    });
}