const { MessageEmbed } = require("discord.js");
const DBL = require('dblapi.js');
const moment = require("moment");
require("moment-duration-format");
const Server = require("../Guild.js");
let talkedRecently = new Set();

module.exports = async message => {
  let client = message.client;
  if (message.author.id !== client.ayar.sahip && (!message.guild || message.channel.type === "dm")) return;
  let mention = new RegExp(`^<@!?${client.user.id}>`);
  let prefix2 = client.ayar.prefix;
  let prefix = message.content.match(mention) ? message.content.match(mention)[0] + " " : prefix2;
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot || message.content.indexOf(prefix) !== 0) return;
  let args = message.content.match(mention) ? message.content.split(' ').slice(2) : message.content.split(' ').slice(1);
  let command = message.content.match(mention) ? message.content.toLowerCase().split(' ')[1] : message.content.toLowerCase().split(' ')[0].slice(prefix.length);
  let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (cmd) {
    let sunucu = await Server.findOne({ guildID: message.guild.id }) || {};
    let dil = message.channel.type == "dm" ? 'en' : (sunucu.dil || 'en');
    if(message.author.id !== client.ayar.sahip) {
      if(talkedRecently.has(message.author.id) && message.guild.id !== client.ayar.dblSunucuID) return message.reply(dil === "tr" ? 'Komutu bir daha kullanabilmek için **5** saniye beklemelisin!' : 'You must wait **5** seconds before you can use the command again!').then(x => x.delete({ timeout: 5000 }));
      talkedRecently.add(message.author.id);
      setTimeout(() => { talkedRecently.delete(message.author.id); }, 5000);
      if(args.includes("@everyone") || args.includes("@here") || args.includes("token")) return message.reply(`xD?`).then(x => x.delete({ timeout: 5000 }));
      let clasEmbed = dil === "tr" ? new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setTimestamp().setColor("RANDOM").addField(`__Bağlantılar__`, `**[Botu Ekle](${client.ayar.ekle})\n[Bota Oy Ver](${client.ayar.oyver})\n[DBL](${client.ayar.dblSayfa})\nDestek Sunucum: ${client.ayar.destekDavet}**`) : new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setTimestamp().setColor("RANDOM").addField(`__Links__`, `**[Add Bot](${client.ayar.ekle})\n[Vote Bot](${client.ayar.oyver})\n[DBL](${client.ayar.dblSayfa})\nSupport Server: ${client.ayar.destekDavet}**`);
      if (!cmd.conf.enabled) return message.channel.send(clasEmbed.setDescription(dil == "tr" ? `**\`${cmd.help.isim}\`  adlı komut şu anda kullanıma kapalıdır!**` : `**This command is currently not available!**`));
      let permLevel = cmd.conf.permLevel ? cmd.conf.permLevel : 0;
      if (permLevel === 1) return message.reply(dil == "tr" ? `**Bu komutu sadece \`Sahibim\` kullanabilir!**` : `**Only my owner can use this command!**`);
      if (permLevel === 2 && !client.ayar.botAdminleri.some(id => message.author.id === id)) return message.reply(dil == "tr" ? `**Bu komutu sadece \`Sahibim\` kullanabilir!**` : `**Only my owner can use this command!**`);
      if (permLevel === 3 && message.author.id !== message.guild.ownerID && !client.ayar.botAdminleri.some(id => message.author.id === id)) return message.reply(dil == "tr" ? `**Bu komutu kullanabilmek için  "\`SUNUCU SAHİBİ\`" olmalısın!**` : `**You must be "\`SERVER OWNER\`" for use this command!**`);
      if (permLevel && permLevel !== 0 && permLevel !== 1 && permLevel !== 2 && permLevel !== 3 && permLevel !== [] && !message.member.hasPermission(permLevel.filter(p => p !== " " && p !==  ""))) return message.reply(dil == "tr" ? `**Bu komutu kullanabilmek için  "\`${permLevel.map(x => yetkiCevir(x)).join(', ')}\`"  ${permLevel.length === 1 ? "iznine" : "izinlerine"} sahip olmalısın!**` : `**You must have "\`${permLevel.join(', ')}\`"  ${permLevel.length === 1 ? "permission" : "permissions"} for use this command!**`);
    };
    
    //const dbl = new DBL(process.env.DBLTOKEN, client);
    //if(message.author.id !== client.ayar.sahip && message.guild.id !== client.ayar.dblSunucuID && message.guild.id !== client.ayar.destekSunucuID && cmd.conf.voted && !await dbl.hasVoted(message.author.id)) return message.channel.send(new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 })).setTimestamp().setColor(client.renk.mor).addField(`Bilgilerim`, `**[Botu Ekle](${client.ayar.ekle})\n[Bota Oy Ver](${client.ayar.oyver})\n[DBL](${client.ayar.dblSayfa})\nDestek Sunucum: ${client.ayar.destekDavet}**`).setDescription(`**${message.author} bu komutu kullanabilmek için bota 12 saatte bir [oy vermelisin!](${client.ayar.oyver})\nOy verdikten sonra işlemesi 1-2 dakika sürebilir.**`));
    cmd.run(client, message, args, prefix2, dil, Server);
    if(cmd.help.kategori === "filtre" || cmd.help.kategori === "filtre-ayar" || cmd.help.kategori === "guard") await client.sunucuLog(message.guild.id, new MessageEmbed().setTitle(dil == "tr" ? 'Bir Komut Kullanıldı!' : "A Command Used!").setColor(client.renk.mavi).setDescription(dil == "tr" ? `${message.author}, **${cmd.help.isim}** adlı komutu ${message.channel} kanalında kullandı!` : `${message.author}, used the command **${cmd.help.name}** on channel ${message.channel}`));
  };
};

function yetkiCevir(perm) {
  return perm.replace("ADMINISTRATOR", "Yönetici").replace("MANAGE_MESSAGES", "Mesajları Yönet").replace("KICK_MEMBERS", "Üyeleri At").replace("BAN_MEMBERS", "Üyeleri Yasakla").replace("MANAGE_GUILD", "Sunucuyu Yönet").replace("MANAGE_CHANNELS", "Kanalları Yönet").replace("MANAGE_ROLES", "Rolleri Yönet").replace("MANAGE_EMOJIS", "Emojileri Yönet").replace("MANAGE_NICKNAMES", "Kullanıcı Adlarını Yönet");
};