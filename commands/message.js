const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix) => {
  let hedef;
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]);
  let kanal = message.mentions.channels.first() || client.channels.cache.get(args[0]);
  let sunucu = client.guilds.cache.get(args[0]);
  if (kullanici) hedef = kullanici;
  if (kanal) hedef = kanal;
  if (sunucu) hedef = sunucu.systemChannel;
  if (!hedef || !args[0] || !args[1]) return message.react('❌');
  hedef.send(args.slice(1).join(' ')).catch(err => message.react('⚠️'));
  message.react('✅');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['mesaj', 'msj', 'msg', 'mesaj-at', 'mesajat', 'gönder', 'send'],
  permLevel: 1,
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'message',
  description: 'Message.',
  usage: 'message [ID] [message]',
  isim: 'mesaj',
  aciklama: 'Mesaj.',
  kullanim: 'mesaj [ID] [mesaj]',
  category: 'sahip'
};