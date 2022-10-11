const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  let veri = sunucu.guvenli ? sunucu.guvenli : [];
  if (args[0] === "off" || args[0] === "reset" || args[0] === "kapat" || args[0] === "sıfırla") {
    await database.updateOne({ guildID: message.guild.id }, { guvenli: [] }, { upsert: true });
    message.channel.send(dil == "tr" ? "Güvenli listesi sıfırlandı!" : "Whitelist has been reset!");
    return;
  };
  let hedef;
  let kisi = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(' '));
  let kanal = message.mentions.channels.first();
  if (kisi) hedef = kisi;
  if (rol) hedef = rol;
  if (kanal) hedef = kanal;
  
  if (!hedef || !args[0]) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor).addField(dil == "tr" ? "Güvenli Liste" : "Whitelist", (veri.length ? veri.map(id => (message.guild.roles.cache.get(id) || message.guild.members.cache.get(id) || message.guild.channels.cache.get(id)) ? (message.guild.roles.cache.get(id) || message.guild.members.cache.get(id) || message.guild.channels.cache.get(id)) : database.updateOne({ guildID: message.guild.id }, { guvenli: veri.filter(v => id !== v) }, { upsert: true })).join(', ') : (dil == "tr" ? "Bulunamadı!" : "Not found!"))));
  if (veri.includes(hedef.id)) {
    veri = veri.filter(w => !w.includes(hedef.id));
    await database.updateOne({ guildID: message.guild.id }, { guvenli: veri }, { upsert: true });
    message.channel.send(new MessageEmbed().setColor(message.member.displayHexColor).setDescription(dil == "tr" ? `${hedef} güvenli listeden kaldırıldı!` : `${hedef} has been removed from whitelist!`));
  } else {
    veri.push(hedef.id);
    await database.updateOne({ guildID: message.guild.id }, { guvenli: veri }, { upsert: true });
    message.channel.send(new MessageEmbed().setColor(message.member.displayHexColor).setDescription(dil == "tr" ? `${hedef} güvenli listeye eklendi! Tekrar aynı işlemi yaparak kaldırabilirsin.` : `${hedef} has been added to whitelist! If you want to remove it, you must type same text.`));
  };
}; 

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['güvenli', 'addwl', 'güvenli-liste', 'white-list', 'guvenli'],
  permLevel: 3,
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'whitelist',
  description: 'Add to whitelist a user/role/channel.',
  usage: 'whitelist member/role/channel/reset',
  isim: 'güvenli',
  aciklama: 'Güvenli listeye bir kullanıcı/rol/kanal ekleme.',
  kullanim: 'güvenli üye/rol/kanal/sıfırla',
  category: 'filtre-ayar'
};