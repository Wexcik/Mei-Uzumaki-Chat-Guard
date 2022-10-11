const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  if (args[0] === "off" || args[0] === "kapat" || args[0] === "kapa" || args[0] === "sıfırla") {
    if (!sunucu.logKanali) return message.reply(dil == "tr" ? "Log kanalı zaten ayarlanmamış!" : "Log channel is not already set!");
    await database.updateOne({ guildID: message.guild.id }, { logKanali: null }, { upsert: true });
    message.channel.send(dil == "tr" ? "Log kanalı devre dışı bırakıldı!" : "Log channel has been deactivated!");
    return;
  };
  
  let kanal = message.mentions.channels.first();
  if (!kanal) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  await database.updateOne({ guildID: message.guild.id }, { logKanali: kanal.id }, { upsert: true });
  message.channel.send(dil == "tr" ? "Log kanalı aktif edildi!" : "Log channel has been activated!");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['log-kanal', 'log', 'logchannel', 'logkanal'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'log-channel',
  description: 'Set the log channel of bot on this server.',
  usage: 'log-channel #textChannel/off',
  isim: 'log-kanal',
  aciklama: 'Botun bu sunucudaki log kanalını ayarlar.',
  kullanim: 'log-kanal #yaziKanali/kapat',
  category: 'filtre-ayar'
};