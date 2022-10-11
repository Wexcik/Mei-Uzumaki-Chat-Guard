const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil) => {
  if (args[0] === "bot") return message.channel.messages.fetch({ limit: 100 }).then(msjlar => message.channel.bulkDelete(msjlar.filter(m => m.author.bot || m.content.startsWith(prefix) || client.noktalama.some(nokta => client.alfabe.some(alfa => m.content.toLowerCase().startsWith(nokta+alfa) || m.content.toLowerCase().startsWith(alfa+nokta) || m.content.toLowerCase().startsWith(nokta+nokta+alfa)))).array()).then(silinen => message.reply(dil == "tr" ? `**${silinen.size}** bot mesajı silindi!` : `**${silinen.size}** bot messages deleted!`).then(x => x.delete({ timeout: 5000 }))));
  if (!args[0] || isNaN(args[0]) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  await message.delete();
  message.channel.bulkDelete(Number(args[0])).then(async c => {
    message.reply(dil == "tr" ? `**${c.size}** mesaj silindi!` : `**${c.size}** messages deleted!`).then(x => x.delete({ timeout: 5000 }));
    await client.sunucuLog(message.guild.id, new MessageEmbed().setTitle(dil == "tr" ? "Sohbet Temizlendi!" : "Chat Cleared!").setDescription(dil == "tr" ? `${message.author}, ${message.channel} kanalında **${c.size}** mesaj sildi!` : `${message.author}, deleted **${c.size}** messages on ${message.channel}!`).setTimestamp().setColor(message.member.displayHexColor));
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['temizle', 'sil', 'clean'],
  permLevel: ["MANAGE_MESSAGES"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'clear',
  description: 'Clear messages.',
  usage: 'clear 1-100/bot',
  isim: 'temizle',
  aciklama: 'Mesaj temizleme.',
  kullanim: 'temizle 1-100/bot',
  category: 'bot'
};