const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  if (!args[0] || (args[0] !== "duration" && args[0] !== "limit" && args[0] !== "süre" && args[0] !== "sure") || !args[1] || isNaN(args[1])) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor).addField(dil == "tr" ? "Not" : "Note", dil == "tr" ? "Süre parametresi, susturulma süresidir (dakika).\nLimit parametresi ise kişinin belirlediğiniz limite ulaşınca cezalandırılacağı limittir." : "Duration parameter is penal duration of mute (minute).\nLimit parameter is the limit that the person will be punished upon reaching the limit you set."));
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  if (args[0] === "duration" || args[0] === "time" || args[0] === "süre" || args[0] === "sure") {
    await database.updateOne({ guildID: message.guild.id }, { ihlalCezaSure: Number(args[1]) }, { upsert: true });
    message.channel.send(dil == "tr" ? "Cezalandırılan kişinin susturulma süresi ayarlandı!" : "Mute duration of punished person has been set!");
  };
  
  if (args[0] === "limit" || args[0] === "sınır" || args[0] === "hak") {
    await database.updateOne({ guildID: message.guild.id }, { ihlalCezaSayi: Number(args[1]) }, { upsert: true });
    message.channel.send(dil == "tr" ? "Ceza limiti ayarlandı!" : "Penal limit has been set!");
  };
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ceza-ayarları', 'ceza-ayarı', 'penalsettings', 'cezaayarları'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'penal-settings',
  description: 'Set the penal settings of bot on this server.',
  usage: 'penal-settings duration/limit <number>',
  isim: 'ceza-ayarları',
  aciklama: 'Botun bu sunucudaki ceza ayarları.',
  kullanim: 'ceza-ayarları süre/limit <sayı>',
  category: 'filtre-ayar'
};