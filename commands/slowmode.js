const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil) => {
  if (!args[0] || isNaN(args[0]) || Number(args[0]) < 0 || Number(args[0]) > 60) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  message.channel.setRateLimitPerUser(Number(args[0]));
  message.react('✅');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['yavaşmod', 'slow-mode', 'yavaş-mod'],
  permLevel: ["MANAGE_CHANNELS"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'slowmode',
  description: 'Set slowmode on message channel.',
  usage: 'slowmode <seconds (0-60)>',
  isim: 'yavaşmod',
  aciklama: 'Yavaş modu mesaj kanalında ayarlar.',
  kullanim: 'yavaşmod <saniye (0-60)>',
  category: 'bot'
};