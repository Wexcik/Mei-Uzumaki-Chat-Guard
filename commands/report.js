const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil) => {
  if (!args[0] || !isNaN(args.join(' '))) return message.channel.send(client.komutBilgi(this.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  if (client.channels.cache.has(client.ayar.talepKanalı)) client.channels.cache.get(client.ayar.talepKanalı).send(new MessageEmbed().setDescription(args.join(' ')).setColor(client.renk.turkuaz).setFooter(message.author.id).setTimestamp().setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, size: 2048 })));
  message.react('✅');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['talep', 'bug', 'request', 'istek', 'öneri', 'şikayet', 'tavsiye', 'suggestions'],
  permLevel: 0,
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'report',
  description: 'Report requests/bugs/suggestions to bot developer.',
  usage: 'report <bugs/suggestions/requests>',
  isim: 'talep',
  aciklama: 'Bot yapımcısına talep/istek/bug/şikayet bildirin.',
  kullanim: 'talep <buglar/öneriler/istekler/şikayetler>',
  category: 'bot'
};