const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  if (!args[0] || (args[0] !== "on" && args[0] !== "off" && args[0] !== "aç" && args[0] !== "kapat" && args[0] !== "kapa")) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  if (args[0] === "on" || args[0] === "aç") {
    if (sunucu.kufurKoruma) return message.reply(sunucu.dil == "tr" ? "Bu özellik zaten sunucuda aktif!" : "This filter is already active on this server!");
    await database.updateOne({ guildID: message.guild.id }, { kufurKoruma: true }, { upsert: true });
    message.channel.send(dil == "tr" ? "Filtre aktif edildi!" : "Filter has been activated!");
    return;
  };
  
  if (args[0] === "off" || args[0] === "kapat" || args[0] === "kapa") {
    if (!sunucu.kufurKoruma) return message.reply(dil == "tr" ? "Bu özellik zaten sunucuda devre dışı!" : "This filter is already deactive on this server!");
    await database.updateOne({ guildID: message.guild.id }, { kufurKoruma: true }, { upsert: true });
    message.channel.send(dil == "tr" ? "Filtre devre dışı bırakıldı!" : "Filter has been deactivated!");
    return;
  };
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['küfür-engel', 'küfür', 'kufur', 'küfür-koruma', 'swear', 'swear-filter'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'swear-filter',
  description: 'Swear words filter.',
  usage: 'swear-filter on/off',
  isim: 'küfür-engel',
  aciklama: 'Küfür filtresi.',
  kullanim: 'küfür-engel aç/kapat',
  category: 'filtre'
};