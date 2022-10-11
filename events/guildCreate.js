const { MessageEmbed } = require("discord.js");

module.exports = async guild => {
  let client = guild.client;
  try {
    let gonderilecek = new MessageEmbed().setColor(guild.owner.displayHexColor).setImage(guild.iconURL({ dynamic: true, size: 2048 })).setAuthor(guild.owner.user.tag, guild.owner.user.avatarURL({ dynamic: true, size: 2048 })).setDescription("• Thank you for add me your server.\nIf you want to more informations about me or my commands informations, you can type **y!help**\n─────────────────────\n• Beni sunucunuza ekleyerek destek olduğunuz için teşekkürler!\n• Hakkımda daha çok bilgiye ve komutlarıma erişmek için **y!yardım** yazabilirsin.").addField(`​\n${"Links"}`, `[Bot Add](${client.ayar.ekle}) | [Support Server](${client.ayar.destekDavet}) | [Vote](${client.ayar.oyver})`);
    guild.owner.send(gonderilecek);
    client.channels.cache.get(client.ayar.HGBBKanalı).send(new MessageEmbed().setDescription(`**Bir sunucuya eklendim! Toplamda \`${(client.guilds.cache.size).toLocaleString()}\` sunucuda ekliyim.**`).addField(`Sunucu Bilgileri`, `**Adı:** ${guild.name}\n**ID:** ${guild.id}\n**Kişi Sayısı:** ${(guild.memberCount).toLocaleString()}\n**Bölgesi:** ${guild.region}\n**Açılma Zamanı:** ${client.tarihHesapla(guild.createdAt)}\n**Sahibi:** ${guild.owner.user.tag} (${guild.owner.id})`).setThumbnail(guild.iconURL({ dynamic: true, size: 1024})).setTimestamp().setColor(client.renk.mor));
    if (guild.systemChannel) guild.systemChannel.send(gonderilecek);
  } catch (err) { console.error(err) };
};