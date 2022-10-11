const { Discord, MessageEmbed } = require("discord.js");

exports.run = async(client, message, args, prefix) => {
  if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
  let code = args.join(' ');

  function clean(text) {
    if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
    text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
    return text;
  };
  try { 
    var evaled = clean(await eval(code));
    if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace("token", "Yasaklı komut").replace(client.token, "Yasaklı komut");
    message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
  } catch(err) { message.channel.send(err, {code: "js", split: true}) };
};

exports.conf = {
  enabled: true, 
  guildOnly: false,
  aliases: ['ev'], 
  permLevel: 1,
  voted: false,
  premium: false,
  nsfw: false
};

exports.help = {
  name: 'eval', 
  description: 'Eval.', 
  usage: 'eval',
  isim: 'eval',
  aciklama: 'Eval.',
  kullanim: 'yenile',
  category: 'sahip'
};