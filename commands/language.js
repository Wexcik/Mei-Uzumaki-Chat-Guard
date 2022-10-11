const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, prefix, dil, database) => {
  if (dil == "tr") {
    await database.updateOne({ guildID: message.guild.id }, { dil: "en" }, { upsert: true });
    message.channel.send(`Botun bu sunucudaki dili başarıyla **İngilizce** olarak ayarlandı!\nThe language of the bot on this server has been successfully set to **English**!`);
  } else {
    await database.updateOne({ guildID: message.guild.id }, { dil: "tr" }, { upsert: true });
    message.channel.send(`The language of the bot on this server has been successfully set to **Turkish**!\nBotun bu sunucudaki dili başarıyla **Türkçe** olarak ayarlandı!`);
  };
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['dil', 'lang'],
  permLevel: ["MANAGE_GUILD"],
  voted: false,
  premium: false,
  nsfw: false
};
  
exports.help = {
  name: 'language',
  description: 'Set the bot language./Botun dilini değiştirirsiniz.',
  usage: 'language',
  isim: 'dil',
  aciklama: 'Botun dilini değiştirirsiniz./Set the bot language.',
  kullanim: 'dil en/tr',
  category: 'bot'
};