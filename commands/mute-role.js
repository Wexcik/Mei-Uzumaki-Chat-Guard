const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  if (args[0] === "off" || args[0] === "kapat" || args[0] === "kapa" || args[0] === "sıfırla") {
    if (!sunucu.muteRolu) return message.reply(dil == "tr" ? "Mute rolü zaten ayarlanmamış!" : "Mute role is not already set!");
    await database.updateOne({ guildID: message.guild.id }, { muteRolu: null }, { upsert: true });
    message.channel.send(dil == "tr" ? "Mute rolü devre dışı bırakıldı!" : "Mute role has been deactivated!");
    return;
  };
  
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(' '));
  if (!rol) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  await database.updateOne({ guildID: message.guild.id }, { muteRolu: rol.id }, { upsert: true });
  message.channel.send(dil == "tr" ? "Mute rolü ayarlandı!" : "Mute role has been set!");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['mute-rolü', 'muterole', 'muterolü', 'mute-rol'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'mute-role',
  description: 'Set the mute role.',
  usage: 'mute-role @role/off',
  isim: 'mute-rolü',
  aciklama: 'Mute rolünü ayarlar.',
  kullanim: 'mute-rolü @rol/kapat',
  category: 'filtre-ayar'
};