const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  if (!args[0] || (args[0] !== "on" && args[0] !== "off" && args[0] !== "aç" && args[0] !== "kapat" && args[0] !== "kapa")) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  if (args[0] === "on" || args[0] === "aç") {
    if (sunucu.reklamBanKoruma) return message.reply(dil == "tr" ? "Bu özellik zaten sunucuda aktif!" : "This filter is already active on this server!");
    await database.updateOne({ guildID: message.guild.id }, { reklamBanKoruma: true }, { upsert: true });
    message.channel.send(dil == "tr" ? "Filtre aktif edildi!" : "Filter has been activated!");
    return;
  };
  
  if (args[0] === "off" || args[0] === "kapat" || args[0] === "kapa") {
    if (!sunucu.reklamBanKoruma) return message.reply(dil == "tr" ? "Bu özellik zaten sunucuda devre dışı!" : "This filter is already deactive on this server!");
    await database.updateOne({ guildID: message.guild.id }, { reklamBanKoruma: false }, { upsert: true });
    message.channel.send(dil == "tr" ? "Filtre devre dışı bırakıldı!" : "Filter has been deactivated!");
    return;
  };
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['reklam-engel-ban', 'reklam-ban', 'invite-ban', 'invitefilter-ban', 'reklamengel-ban', 'reklam-ban-filtresi'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'invite-filter-ban',
  description: 'Invite links ban filter.',
  usage: 'invite-filter on/off',
  isim: 'reklam-engel-ban',
  aciklama: 'Reklam ban filtresi.',
  kullanim: 'reklam-engel-ban aç/kapat',
  category: 'filtre'
};