const { MessageEmbed } = require("discord.js");

module.exports = client => {
  let prefix = client.ayar.prefix;
  console.log(`BOT: Aktif, ${client.commands.size} komut yüklendi!`);
  console.log(`BOT: ${client.user.username} ismi ile giriş yapıldı ve ${client.guilds.cache.size} sunucuya, ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} kullanıcıya hizmet veriliyor!`);
  if(client.channels.cache.has(client.ayar.durumKanalı)) client.channels.cache.get(client.ayar.durumKanalı).send(new MessageEmbed().setColor(client.renk.yesil).setTimestamp().setTitle(client.user.username + " Durum").setThumbnail(client.user.avatarURL({ dynamic: true, size: 1024 })).setDescription(`**Aktif oldum! Anlık olarak;\n\`${(client.guilds.cache.size).toLocaleString()}\` sunucuya,\n\`${(client.channels.cache.size).toLocaleString()}\` kanala,\n\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\` kullanıcıya hizmet veriyorum.**`));
  client.user.setStatus("idle");
  setInterval(() => { client.user.setActivity(`Wex Chat Guardian System's`,{ type: "WATCHING"}); }, 1000*15);
};