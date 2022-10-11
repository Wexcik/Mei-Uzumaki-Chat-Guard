const { MessageEmbed } = require("discord.js");
const Server = require("../Guild.js");

module.exports = async guild => {
  let client = guild.client;
  try {
    await Server.findOneAndDelete({ guildID: guild.id });
    client.channels.cache.get(client.ayar.HGBBKanalı).send(new MessageEmbed().setDescription(`**Bir sunucudan atıldım! Toplamda \`${(client.guilds.cache.size).toLocaleString()}\` sunucuda ekliyim.**`).addField(`Sunucu Bilgileri`, `**Adı:** ${guild.name}\n**ID:** ${guild.id}\n**Kişi Sayısı:** ${(guild.memberCount).toLocaleString()}\n**Bölgesi:** ${guild.region}\n**Açılma Zamanı:** ${client.tarihHesapla(guild.createdAt)}\n**Sahibi:** ${guild.owner.user.tag} (${guild.owner.id})`).setThumbnail(guild.iconURL({ dynamic: true, size: 1024})).setTimestamp().setColor(client.renk.mor));
  } catch (err) { console.error(err) };
};