const { Client, Intents,  MessageEmbed, Collection, WebhookClient } = require('discord.js');
const client = global.client = new Client({
  fetchAllMembers: true
  }
);
const mongoose = require('mongoose');
mongoose.connect('PİPİMİ YEĞĞ', {useNewUrlParser: true, useUnifiedTopology: true})
require('./util/eventLoader')(client);
require('./util/functionHandler')(client);
require('./util/prototypes');
const fs = require('fs');
const Server = require("./Guild.js");

const log = message => {
  console.log(`${message}`);
};
require('events').EventEmitter.prototype._maxListeners = 20;
require('events').defaultMaxListeners = 20;
  process.on('warning', function (err) {
    if ( 'MaxListenersExceededWarning' == err.name ) {
    }
  });
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    if(!f.endsWith('.js')) return;
    let props = require(`./commands/${f}`);
    log(`${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.ayar = {
  "prefix": "w?",
  "sahip": "728161454288535604",
  "token": "SİKİNİ YİYİN WEX HERZAMAN ZİRVEDE",
  "botAdminleri": ["728161454288535604"],
  "talepKanalı": "1011387563933704223",
  "HGBBKanalı": "1011388833574690916",
  "durumKanalı": "1011388957994537081",
  "dmLogKanalı": "1011388994073935892",
  "dblSunucuID": "960561059796762725",
  "destekSunucuID": "960561059796762725",
  "destekDavet": " https://discord.gg/DMGukeH6TT",
  "dblSayfa": "",
  "oyver": "",
  "ekle": ""
};

client.renk = {
  renksiz:"2F3136",
 acikturkuaz: "#1abc9c",
  koyuturkuaz: "#16a085",
  acikyesil: "#2ecc71",
  koyuyesil: "#27ae60",
  acikmavi: "#3498db",
  koyumavi: "#2980b9",
  acikmor: "#9b59b6",
  koyumor: "#8e44ad",
  sari: "#f1c40f",
  turuncu: "#f39c12",
  acikturuncu: "#e67e22",
  acikkirmizi: "#e74c3c",
  koyukirmizi: "#c0392b",
  beyaz: "#ecf0f1"
};
client.login(client.ayar.token);


var prefix = client.ayar.prefix;

const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
    warnThreshold: 4, // Amount of messages sent in a row that will cause a warning.
    kickThreshold: 7, // Amount of messages sent in a row that will cause a ban.
    banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
    maxInterval: 1000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: '{@user}, Please stop spamming. (Lütfen spam yapma)', // Message that will be sent in chat upon warning a user.
    kickMessage: '**{user_tag}** has been kicked for spamming. (Spam yaptığu için atıldı)', // Message that will be sent in chat upon kicking a user.
    banMessage: '**{user_tag}** has been banned for spamming. (Spam yaptığı için yasaklandı)', // Message that will be sent in chat upon banning a user.
    maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
    exemptPermissions: ['ADMINISTRATOR'], // Bypass users with any of these permissions.
    ignoreBots: true, // Ignore bot messages.
    verbose: true, // Extended Logs from module.
    ignoredUsers: [], // Array of User IDs that get ignored.
    // And many more options... See the documentation.
});

// Chat Korumaları
var reklamBanKoruma = {};

client.on('message', async message => {
  
  if (!message || !message.guild || !message.member || message.author.id === client.user.id) return;
  let data = await Server.findOne({ guildID: message.guild.id }) || {};
  let dil = data.dil || "en";

  if(await client.botTemizleme(message) == true && message.deletable) return message.delete({ timeout: 5000, reason: (dil == "tr" ? "Bot Komutu" : "Bot Command") });
  let sonuc = await client.chatKoruma(message);
  if (data.reklamBanKoruma && sonuc == "reklamKoruma") {
    if (!reklamBanKoruma[message.guild.id]) reklamBanKoruma[message.guild.id] = new Map();
    let onceki = reklamBanKoruma[message.guild.id].get(message.author.id) || 0;
    reklamBanKoruma[message.guild.id].set(message.author.id, Number(onceki)+1);
    if (Number(reklamBanKoruma[message.guild.id].get(message.author.id)) >= 5) {
      message.guild.members.ban(message.author.id, { reason: "Wex | Invite Filter" });
      reklamBanKoruma[message.guild.id].set(message.author.id, 0);
      await client.sunucuLog(message.guild.id, new MessageEmbed().setTitle(dil == "tr" ? "Reklam Koruma - Ban" : "Invite Filter - Ban").setDescription(dil == "tr" ? `${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`) üyesi, ${message.channel} kanalında **reklam spamı** yaptığı için sunucudan **yasaklandı!**` : `${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`) banned because of **invite spamming** in ${message.channel} channel!`).setFooter(client.user.username + " Invite Filter", client.user.avatarURL()).setTimestamp());
    };
  };
  if(sonuc == "reklamKoruma") return await client.ihlalIslem(message, (dil == "tr" ? "Sunucu Reklamı" : "Server Invite"), 4);
  if(sonuc == "etiketKoruma") return await client.ihlalIslem(message, (dil == "tr" ? "Fazla Etiket" : "Too Much Mention"), 3);
  if(sonuc == "linkKoruma") return await client.ihlalIslem(message, "Link", 1);
  if(sonuc == "kufurKoruma") {
    if (message.author.id === client.ayar.sahip) {
      message.delete({ timeout: 100 });
      message.reply("これはダメ!あなたー様はヤシヌですから・").then(x => x.delete({ timeout: 10000 }));
    } else {
      await client.ihlalIslem(message, (dil == "tr" ? "Küfür/Hakaret" : "Swear/Insult"), 1);
    };
    return;
  }; 
  if(sonuc == "filtreKelimeler") return await client.ihlalIslem(message, (dil == "tr" ? "Filtrelenmiş Kelime" : "Filtered Word"), 1);
  if(sonuc == "capsKoruma") return await client.ihlalIslem(message, (dil == "tr" ? "Fazla Büyük Harf" : "Capital Letter"), 1);
  if(sonuc == "emojiSpamKoruma") return await client.ihlalIslem(message, "Emoji Spam", 1);
  if (dil.spamKoruma) {
    antiSpam.message(message);
    let msjs = await message.channel.messages.fetch();
    if (msjs.filter(m => (Date.now()-m.createdTimestamp) < 2000).size > 30) {
      message.channel.overwritePermissions(message.guild.roles.cache.find(r => r.name === "@everyone"), { SEND_MESSAGES: false });
      await client.sunucuLog(message.guild.id, new MessageEmbed().setTitle(dil == "tr" ? "Kanal Kilitlendi!" : "Channel Locked!").setDescription(dil == "tr" ? `${message.channel} kanalı spam yapıldığı için kilitlendi!` : `${message.channel} channel has been locked because of spamming!`).setFooter(client.user.username + " Spam Filter", client.user.avatarURL()).setTimestamp());
    };
  };
});

client.on('messageUpdate', async (oldMessage, message) => {
  if(!message || message.channel.type === "dm" || !message.guild || !message.member) return;
  let data = await Server.findOne({ guildID: message.guild.id }) || {};
  let dil = data.dil || "en";
  let sonuc = await client.chatKoruma(message);
  if (data.reklamBanKoruma && sonuc == "reklamKoruma") {
    if (!reklamBanKoruma[message.guild.id]) reklamBanKoruma[message.guild.id] = new Map();
    let onceki = reklamBanKoruma[message.guild.id].get(message.author.id) || 0;
    reklamBanKoruma[message.guild.id].set(message.author.id, Number(onceki)+1);
    if (Number(reklamBanKoruma[message.guild.id].get(message.author.id)) >= 5) {
      message.guild.members.ban(message.author.id, { reason: "Wex | Reklam Ban Koruma" });
      reklamBanKoruma[message.guild.id].set(message.author.id, 0);
      await client.sunucuLog(message.guild.id, new MessageEmbed().setTitle(dil == "tr" ? "Reklam Koruma - Ban" : "Invite Filter - Ban").setDescription(dil == "tr" ? `${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`) üyesi, ${message.channel} kanalında **reklam spamı** yaptığı için sunucudan **yasaklandı!**` : `${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`) banned because of **invite spamming** in ${message.channel} channel!`).setFooter(client.user.username + " Invite Filter", client.user.avatarURL()).setTimestamp());
    };
  };
  if(sonuc == "reklamKoruma") return await client.ihlalIslem(message, (dil == "tr" ? "Sunucu Reklamı" : "Server Invite"), 4);
  if(sonuc == "etiketKoruma") return await client.ihlalIslem(message, (dil == "tr" ? "Fazla Etiket" : "Too Much Mention"), 3);
  if(sonuc == "linkKoruma") return await client.ihlalIslem(message, "Link", 1);
  if(sonuc == "kufurKoruma") return await client.ihlalIslem(message, (dil == "tr" ? "Küfür/Hakaret" : "Swear/Insult"), 1);
  if(sonuc == "filtreKelimeler") return await client.ihlalIslem(message, (dil == "tr" ? "Filtrelenmiş Kelime" : "Filtered Word"), 1);
  if(sonuc == "capsKoruma") return await client.ihlalIslem(message, (dil == "tr" ? "Fazla Büyük Harf" : "Capital Letter"), 1);
  if(sonuc == "emojiSpamKoruma") return await client.ihlalIslem(message, "Emoji Spam", 1);
});
// Chat Korumaları Bitiş
client.on("messageDelete", async message => {
  if (!message.guild || !message.member || message.author.bot || !message.content  || message.author.id === client.user.id) return;
  let data = await Server.findOne({ guildID: message.guild.id }) || {};
  let dil = data.dil || "en";
  let sonuc = await client.chatKoruma(message);
  if (!sonuc && data.logKanali) await client.sunucuLog(message.guild.id, new MessageEmbed().setTitle(dil == "tr" ? "Mesaj Silindi!" : "Message Deleted!").setColor("RED").setTimestamp().setDescription(dil == "tr" ? `${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`) üyesi tarafından ${message.channel} kanalında gönderilen mesaj silindi!\n\n**\`•\` Mesaj İçeriği:** ${message.content.length > 1000 ? "Fazla uzun olduğu için görüntülenemiyor!" : message.content}` : `The message sent by ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`) member in channel ${message.channel} has been deleted!\n\n**\`•\` Message Content:** ${message.content.length > 1000 ? "Cannot be displayed because it is too long!" : message.content}`));
});
client.on('message', (message) => {
  const Content = message.content.replace(/\**/g,"").replace(/\_/g, "").replace(/\__/g, "");
  if (((Content.match(/\s/g) || []).length / Content.length >= 0.7) && !message.deleted)   message.reply("`Mesajınızda çok fazla boşluk var, galiba spam yapmaya çalışıyorsun bu yüzden mesajını sildim.`").then(x => x.delete({timeout: 5000}))
,  message.delete({ timeout: 200 });
});