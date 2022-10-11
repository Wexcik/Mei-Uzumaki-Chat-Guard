const { MessageEmbed } = require("discord.js");

exports.run = async function(client, message, params, prefix) {
  if(params[0]) {
    let commandName  = params[0].toLowerCase()
    try {
      delete require.cache[require.resolve(`./${commandName}.js`)]
      client.commands.delete(commandName)
      const pull = require(`./${commandName}.js`)
      client.commands.set(commandName, pull)
    } catch(e) { return message.channel.send(`Bir hata oluştu ve **${commandName}** adlı komut reloadlanamadı.`); };
    
    message.channel.send(`__**${commandName}**__ adlı komut yeniden başlatılıyor!`);
    return;
  };
  message.channel.send(`__**Bot**__ yeniden başlatılıyor!`).then(msg => {
    console.log('[BOT] Yeniden başlatılıyor...')
    process.exit(0);
  });
};

exports.conf = {
  enabled: true, 
  guildOnly: false,
  aliases: ['yenile', 'reload'], 
  permLevel: 1,
  voted: false,
  premium: false,
  nsfw: false
};

exports.help = {
  name: 'reboot', 
  description: 'Botu veya belirtilen komutu yeniden başlatır.', 
  usage: 'reboot',
  isim: 'yenile',
  aciklama: 'Botu veya belirtilen komutu yeniden başlatır.',
  kullanim: 'yenile',
  category: 'sahip'
};