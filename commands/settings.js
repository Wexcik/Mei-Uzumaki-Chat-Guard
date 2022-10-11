const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  if (args[0] === "reset" || args[0] === "sıfırla") {
    await database.findOneAndDelete({ guildID: message.guild.id });
    message.reply(dil == "tr" ? "Ayarlar sıfırlandı!" : "Settings has been reset!");
    return;
  };
  let sunucu = await database.findOne({ guildID: message.guild.id }) || {};
  let filtreKelimeler = sunucu.filtreKelimeler || [];
  let botTemizleyiciKanallari = sunucu.botTemizleyiciKanallari || [];
  let gonderilecek = new MessageEmbed().setAuthor(message.guild.name + (dil == "tr" ? " Ayarlar" : " Settings"), message.guild.iconURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor).setFooter(dil == "tr" ? `Tüm ayarları sıfırlamak için => ${prefix+this.help.isim} sıfırla` : `For reset the all settings => ${prefix+this.help.name} reset`)
  .addField((dil == "tr" ? "Filtreler" : "Filters"), `\`\`\`css\n${dil == "tr" ? "Küfür" : "Swear"}: ${sunucu.kufurKoruma ? "✅" : "❌"}\n${dil == "tr" ? "Reklam" : "Invite"}: ${sunucu.reklamKoruma ? "✅" : "❌"}\n${dil == "tr" ? "Reklam-Ban" : "Invite-Ban"}: ${sunucu.reklamBanKoruma ? "✅" : "❌"}\n${dil == "tr" ? "Link" : "Link"}: ${sunucu.linkKoruma ? "✅" : "❌"}\n${dil == "tr" ? "Büyük Harf" : "Capslock"}: ${sunucu.capsKoruma ? "✅" : "❌"}\n${dil == "tr" ? "Etiket" : "Mention"}: ${sunucu.etiketKoruma ? "✅" : "❌"}\nSpam: ${sunucu.spamKoruma ? "✅" : "❌"}\nEmoji Spam: ${sunucu.emojiSpamKoruma ? "✅" : "❌"}\`\`\``, true)
  .addField((dil == "tr" ? "Filtre Ayarları" : "Filter Settings"), `\`\`\`css\n${dil == "tr" ? "Log Kanalı" : "Log Channel"}: ${sunucu.logKanali ? "#"+message.guild.channels.cache.get(sunucu.logKanali).name : "❌"}\n${dil == "tr" ? "Mute Rolü" : "Mute Role"}: ${sunucu.muteRolu ? "@"+message.guild.roles.cache.get(sunucu.muteRolu).name : "❌"}\n${dil == "tr" ? "Ceza Limit" : "Penal Limit"}: ${sunucu.ihlalCezaSayi ? sunucu.ihlalCezaSayi : "10"}\n${dil == "tr" ? "Ceza Süre" : "Penal Duration"}: ${sunucu.ihlalCezaSure ? sunucu.ihlalCezaSure : "10"}\`\`\``, true)
  .addField((dil == "tr" ? "Filtrelenmiş Kelimeler" : "Filtered Words"), `\`\`\`css\n${(filtreKelimeler.length > 0 ? `${filtreKelimeler.slice(0, 5).join('╱')}...\n\n${prefix+(dil == "tr" ? "filtre" : "filter")}` : (dil == "tr" ? "Bulunamadı!" : "Not found!"))}\`\`\``, true)
  .addField((dil == "tr" ? "Sohbet Temizleyici" : "Chat Cleaner"), `\`\`\`css\n${(botTemizleyiciKanallari.length > 0 ? `${botTemizleyiciKanallari.slice(0, 5).map(knl => "#"+message.guild.channels.cache.get(knl).name).join(' │ ')}...\n\n${prefix+(dil == "tr" ? "sohbet-temizleyici" : "chat-cleaner")}` : (dil == "tr" ? "Bulunamadı!" : "Not found!"))}\`\`\``, true)
  message.channel.send(gonderilecek);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ayarlar', 'ayar', 'setting'],
  permLevel: ["ADMINISTRATOR", "MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'settings',
  description: 'Server settings.',
  usage: 'settings',
  isim: 'ayarlar',
  aciklama: 'Sunucu ayarları.',
  kullanim: 'ayarlar',
  category: 'bot'
};