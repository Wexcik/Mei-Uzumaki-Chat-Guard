const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil) => {
  let cmd;
  if (client.commands.has(args[0])) cmd = client.commands.get(args[0])
  else if (client.aliases.has(args[0])) cmd = client.commands.get(client.aliases.get(args[0]));
  
  if (cmd) return message.channel.send(client.komutBilgi(cmd.help.name, dil).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor));
  let menu = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setColor(message.member.displayHexColor)
  .setDescription(dil == "tr" ? `Bir komut hakkında bilgi almak için; \`${prefix+this.help.kullanim}\`\n\n${client.commands.filter(kmt => kmt.help.category === "bot").map(kmt => "**▫️ "+prefix+kmt.help.isim+":** "+kmt.help.aciklama).join('\n')}` : `\`${prefix+this.help.usage}\` to get a command information.\n\n${client.commands.filter(kmt => kmt.help.category === "bot").map(kmt => "**▫️ "+prefix+kmt.help.name+":** "+kmt.help.description).join('\n')}`)
  .addField(dil == "tr" ? "Sohbet Filtreleri" : "Chat Filters", dil == "tr" ? client.commands.filter(kmt => kmt.help.category === "filtre").map(kmt => "**▫️ "+prefix+kmt.help.isim+":** "+kmt.help.aciklama).join('\n') : client.commands.filter(kmt => kmt.help.category === "filtre").map(kmt => "**▫️ "+prefix+kmt.help.name+":** "+kmt.help.description).join('\n'))
  .addField(dil == "tr" ? "Filtre Ayarları" : "Filter Settings", dil == "tr" ? client.commands.filter(kmt => kmt.help.category === "filtre-ayar").map(kmt => "**▫️ "+prefix+kmt.help.isim+":** "+kmt.help.aciklama).join('\n') : client.commands.filter(kmt => kmt.help.category === "filtre-ayar").map(kmt => "**▫️ "+prefix+kmt.help.name+":** "+kmt.help.description).join('\n'))
  .addField(`​\n${dil == "tr" ? "Bağlantılar" : "Links"}`, dil == "tr" ? `[Bot Davet Linki](${client.ayar.ekle}) | [Destek Sunucusu](${client.ayar.destekDavet}) | [Oy Ver (Vote)](${client.ayar.oyver})` : `[Bot Add](${client.ayar.ekle}) | [Support Server](${client.ayar.destekDavet}) | [Vote](${client.ayar.oyver})`);
  message.channel.send(menu);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['yardım', 'y', 'h', 'yardim', 'davet'],
  permLevel: 0,
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'help',
  description: 'Help Menu',
  usage: 'help <command name>',
  isim: 'yardım',
  aciklama: 'Yardım Menüsü',
  kullanim: 'yardım <komut adı>',
  category: 'bot'
};