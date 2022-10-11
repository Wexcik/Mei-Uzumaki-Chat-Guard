const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  let veri = sunucu.botTemizleyiciKanallari || [];
  if (args[0] === "off" || args[0] === "reset" || args[0] === "kapat" || args[0] === "sıfırla") {
    await database.updateOne({ guildID: message.guild.id }, { botTemizleyiciKanallari: [] }, { upsert: true });
    message.channel.send(dil == "tr" ? "Sohbet (bot) temizleyici ayarı sıfırlandı!" : "Chat (bot) cleaner settings has been reset!");
    return;
  };
  if (args[0] === "all" || args[0] === "tüm" || args[0] === "hepsi") {
    let kaydedilecekler = message.guild.channels.cache.filter(knl => knl.type === "text" && (!knl.name.includes('komut') && !knl.name.includes('command') && !knl.name.includes('bot') && !knl.name.includes('welcome') && !knl.name.includes('teyit') && !knl.name.includes('register') && !knl.name.includes('giriş') && !knl.name.includes('hoşgeldin') && !knl.name.includes('invite') && !knl.name.includes('davet') && !knl.name.includes('log') && !knl.name.includes('announ') && !knl.name.includes('information') && !knl.name.includes('partner'))).array();
    await database.updateOne({ guildID: message.guild.id }, { botTemizleyiciKanallari: kaydedilecekler.map(knl => knl.id) }, { upsert: true });
    message.channel.send(new MessageEmbed().setColor(message.member.displayHexColor).setTitle(dil == "tr" ? "Sohbet Temizleyici" : "Chat Cleaner").setDescription(`${kaydedilecekler.map(x => x).join(', ')} ${dil == "tr" ? "kanalları eklendi!" : "channels has been added!"}`));
    return;
  };
  let kanal = message.mentions.channels.first();
  if (!kanal || !args[0]) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor).addField(dil == "tr" ? "Ayarlanan Kanallar" : "Adjusted Channels", (veri.length ? veri.map(knl => (message.guild.channels.cache.has(knl) ? message.guild.channels.cache.get(knl).toString() : database.updateOne({ guildID: message.guild.id }, { botTemizleyiciKanallari: veri.filter(a => a !== knl) }, { upsert: true }))).join(', ') : (dil == "tr" ? "Bulunamadı!" : "Not found!"))));
  if (veri.includes(kanal.id)) {
    veri = veri.filter(knl => !knl.includes(kanal.id));
    await database.updateOne({ guildID: message.guild.id }, { botTemizleyiciKanallari: veri }, { upsert: true });
    message.channel.send(dil == "tr" ? `${kanal} listeden kaldırıldı!` : `${kanal} has been removed from list!`);
  } else {
    veri.push(kanal.id);
    await database.updateOne({ guildID: message.guild.id }, { botTemizleyiciKanallari: veri }, { upsert: true });
    message.channel.send(dil == "tr" ? `${kanal} eklendi! Tekrar aynı işlemi yaparak kaldırabilirsin.` : `${kanal} has been added! If you want to remove it, you must type same text.`);
  };
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sohbet-temizleyici', 'us', 'chatcleaner', 'sohbettemizleyici', 'bot-temizleyici', 'bottemizleyici'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'chat-cleaner',
  description: 'Bot messages/commands cleaner.',
  usage: 'chat-cleaner #textChannel/all/off',
  isim: 'sohbet-temizleyici',
  aciklama: 'Bot mesajı/komutu temizleyici.',
  kullanim: 'sohbet-temizleyici #yaziKanali/tüm/kapat',
  category: 'filtre'
};