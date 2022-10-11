const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  let veri = sunucu.filtreKelimeler || [];
  if (!args[0]) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  let girilen = args.join(' ');
  if (girilen === "list" || girilen === "liste") return message.channel.send(new MessageEmbed().setDescription(veri.length > 0 ? veri.join('\n') : (dil == "tr" ? "Bulunamadı!" : "Not found!")).setAuthor(message.guild.name + dil == "tr" ? "Filtrelenmiş Kelimeler" : "Filtered Words", message.guild.iconURL({ dynamic: true, size: 2048 })));
  if (!isNaN(girilen) || girilen.length < 3 || girilen.length > 50) return message.reply(dil == "tr" ? "Filtrelenecek geçerli bir kelime/cümle belirtmelisin!" : "You must specify a valid word/sentence to be filtered!");
  if (veri.includes(girilen)) {
    veri = veri.filter(v => v != girilen);
    await database.updateOne({ guildID: message.guild.id }, { filtreKelimeler: veri }, { upsert: true });
    message.channel.send(dil == "tr" ? `__${girilen}__ filtrelerden kaldırıldı!` : `__${girilen}__ has been removed from filters!`);
  } else {
    if (veri.length > 30) return message.reply(dil == "tr" ? "En fazla 30 filtre eklenebilir!" : "Up to 30 filters can be added!");
    veri.push(girilen);
    await database.updateOne({ guildID: message.guild.id }, { filtreKelimeler: veri }, { upsert: true });
    message.channel.send(dil == "tr" ? `__${girilen}__ filtrelendi! Tekrar aynı işlemi yaparak kaldırabilirsin.` : `__${girilen}__ filtered! If you want to remove it, you must type same text.`);
  };
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['filtre', 'word-filter', 'kelime-filtre'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'filter',
  description: 'Word/sentence filter.',
  usage: 'filter word/list',
  isim: 'filtre',
  aciklama: 'Kelime/cümle filtresi.',
  kullanim: 'filtre kelime/liste',
  category: 'filtre'
};