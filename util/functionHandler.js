const { Client, MessageEmbed, Collection, WebhookClient } = require('discord.js');
const Server = require("../Guild.js");

module.exports = client => {
  client.commands = new Collection();
  client.aliases = new Collection();
  client.reload = command => {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(`../commands/${command}`)];
        let cmd = require(`../commands/${command}`);
        client.commands.delete(command);
        client.aliases.forEach((cmd, alias) => {
          if (cmd === command) client.aliases.delete(alias);
        });
        client.commands.set(command, cmd);
        cmd.conf.aliases.forEach(alias => {
          client.aliases.set(alias, cmd.help.name);
        });
        resolve();
      } catch (e){
        reject(e);
      }
    });
  };
  
  client.load = command => {
    return new Promise((resolve, reject) => {
      try {
        let cmd = require(`../commands/${command}`);
        client.commands.set(command, cmd);
        cmd.conf.aliases.forEach(alias => {
          client.aliases.set(alias, cmd.help.name);
        });
        resolve();
      } catch (e){
        reject(e);
      }
    });
  };
  
  client.unload = command => {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(`../commands/${command}`)];
        let cmd = require(`../commands/${command}`);
        client.commands.delete(command);
        client.aliases.forEach((cmd, alias) => {
          if (cmd === command) client.aliases.delete(alias);
        });
        resolve();
      } catch (e){
        reject(e);
      }
    });
  };
  
  client.splitEmbedWithDesc = async function(description, author = false, footer = false, features = false) {
    let embedSize = parseInt(`${description.length/2048}`.split('.')[0])+1
    let embeds = new Array()
    for (var i = 0; i < embedSize; i++) {
      let desc = description.split("").splice(i*2048, (i+1)*2048)
      let x = new MessageEmbed().setDescription(desc.join(""))
      if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
      if (i == embedSize-1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
      if (i == embedSize-1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
      if (features) {
        let keys = Object.keys(features)
        keys.forEach(key => {
          if (key == "setTimestamp") return
          let value = features[key]
          if (i !== 0 && key == 'setColor') x[key](value[0])
          else if (i == 0) {
            if(value.length == 2) x[key](value[0], value[1])
            else x[key](value[0])
          }
        })
      }
      embeds.push(x)
    }
    return embeds
  };
  
/* client.sayfaliEmbed = async function(description, author = false, footer = false, feautuers = false) {
    let menu= new MessageEmbed().setTitle(`${client.user.username} - Komut menüsü`).setColor("#36393f").setThumbnail("https://cdn.discordapp.com/avatars/343496705196556288/50815afab8904313ca6a062e3dd7c88d.webp").setFooter(client.user.tag, client.user.avatarURL()).setDescription("*Yardım menüsü yükleniyor, lütfen bekleyiniz!*")
    const msg= await message.channel.send(menu)
    let currentPage=1;let cmds=client.commands.array();let newCmds=[];for(let index=0;index<cmds.length;index+=10){let newArrs=cmds.slice(index,index+10);newCmds.push(newArrs)};
    let reactions=["◀","❌","▶"],numbers=["698608981572059157", "698609026375745646", "698609076308803604", "698609179375566888", "698609217862500372", "698609281137770525", "698609325673021451", "698609367041310780", "698609404379136111", "698609436016508988"] // buraya sırası ile "0, 1, 2, 3, 4, 5, 6, 7, 8, 9" emojilerinin ID'leri yazılacak!
    for (let reaction of reactions) await msg.react(reaction);
    for (let emoji of numbers) await msg.react(emoji)
    msg.edit(menu.setURL("http://discord.com/users/343496705196556288").setDescription(`**Toplam komut:** \`${client.commands.size}\`\n**Şu anki sayfa:** \`${currentPage}\`\n\n`+newCmds[currentPage-1].map((e,i) => `**m!${e.help.name}** \`=>\` ${e.help.description} (${client.emojis.cache.get(numbers[i]).toString()})`).join("\n")))
    const back = msg.createReactionCollector((reaction,user)=>reaction.emoji.name=="◀"&&user.id==message.author.id,{time:60000}),x=msg.createReactionCollector((reaction,user)=>reaction.emoji.name=="❌"&&user.id==message.author.id,{time:60000}),go=msg.createReactionCollector((reaction,user)=>reaction.emoji.name=="▶"&&user.id==message.author.id,{time:60000});
    back.on("collect",async(reaction)=>{
      await reaction.users.remove(message.author.id);
      if (menu.title.includes(`${client.user.username} - Komut hakkında`)) return msg.edit(await menu.setThumbnail("https://cdn.discordapp.com/avatars/588795396948623467/828b86c86675e0cc205ff79f2ad7dc63.png?size=2048").setTitle(`${client.user.username} - Komut menüsü`).setDescription(`**Toplam komut:** \`${client.commands.size}\`\n**Şu anki sayfa:** \`${currentPage}\`\n\n`+newCmds[currentPage-1].map((e, i) => `**m!${e.help.name}** \`=>\` ${e.help.description} (${client.emojis.cache.get(numbers[i]).toString()})`).join("\n")));
      if (currentPage == 1) return;
      currentPage--;
      msg.edit(await menu.setURL("discord.com/users/http://discord.com/users/343496705196556288").setDescription(`**Toplam komut:** \`${client.commands.size}\`\n**Şu anki sayfa:** \`${currentPage}\`\n\n`+newCmds[currentPage-1].map((e,i) => `**m!${e.help.name}** \`=>\` ${e.help.description} (${client.emojis.cache.get(numbers[i]).toString()})`).join("\n")))
    })
    go.on("collect",async(reaction)=>{
      await reaction.users.remove(message.author.id);
      if (menu.title.includes(`${client.user.username} - Komut hakkında`)) return;
      if (currentPage == newCmds.length) return;
      currentPage++;
      msg.edit(await menu.setURL("http://discord.com/users/343496705196556288").setThumbnail("https://cdn.discordapp.com/avatars/588795396948623467/828b86c86675e0cc205ff79f2ad7dc63.png?size=2048").setDescription(`**Toplam komut:** \`${client.commands.size}\`\n**Şu anki sayfa:** \`${currentPage}\`\n\n`+newCmds[currentPage-1].map((e,i) => `**m!${e.help.name}** \`=>\` ${e.help.description} (${client.emojis.cache.get(numbers[i]).toString()})`).join("\n")))
    })
    back.on("end", async() => {
       await back.stop();
       await go.stop();
       message.delete();
       return msg.delete();
    })
    for (let id of numbers) {
      let collector = msg.createReactionCollector((reaction, user) => reaction.emoji.id == id && user.id == message.author.id, {time: 60000})
      x.on("collect",async(reaction)=>{
       await back.stop();
       await go.stop();
       await collector.stop();
       message.delete();
       return msg.delete();
      })
      collector.on("collect", async(reaction) => {
        await reaction.users.remove(message.author.id);
        if (!menu.description.startsWith(`**Toplam komut:**`)) return;
        if (newCmds[currentPage - 1].length < numbers.indexOf(reaction.emoji.id) + 1) return;
        let cmd = newCmds[currentPage - 1][numbers.indexOf(reaction.emoji.id)];
        msg.edit(await menu.setTitle(`${client.user.username} - Komut hakkında`).setDescription(`**İsim** \`=>\` ${cmd.help.name}\n**Kullanım** \`=>\` ${cmd.help.usage}\n**Açıklama** \`=>\` ${cmd.help.description}\n**Kısaltmaları** \`=>\` ${cmd.conf.aliases.length == 0 ? "**Kısaltma yok**" : cmd.conf.aliases.map(e => `**${e}**`).join(" `|` ")}\n**Yetki seviyesi** \`=>\` ${cmd.conf.permLevel}\n**Bakımda mı?** \`=>\` ${cmd.conf.enabled ? "**Hayır**" : "**Evet**"}\n**Sunucuya özel** \`=>\` ${cmd.conf.guildOnly ? "**Evet**" : "**Hayır**"}`))
      })
    }
  };*/
  
  client.komutBilgi = function(isim, dil) {
    let komut = client.commands.get(isim);
   // return knl.send(dil == "tr" ? `= Komut Bilgi = \nAdı :: ${komut.help.isim}\nAlternatif(ler) :: ${komut.conf.aliases.join(', ')}\nAçıklama :: ${komut.help.aciklama}\nKullanım :: ${komut.help.kullanim}` : `= Command Information = \nName :: ${komut.help.name}\nAliase(s) :: ${komut.conf.aliases.join(', ')}\nDescription :: ${komut.help.description}\nUsage :: ${komut.help.usage}`, { code: "asciidoc", split: true });
    return new MessageEmbed().setDescription(`${dil == "tr" ? `**= Komut Bilgi =** \n\`Adı:\` ${komut.help.isim}\n\`Alternatif(ler):\` ${komut.conf.aliases.join(', ')}\n\`Açıklama:\` ${komut.help.aciklama}\n\`Kullanım:\` ${komut.help.kullanim}` : `**= Command Information =** \n\`Name:\` ${komut.help.name}\n\`Aliase(s):\` ${komut.conf.aliases.join(', ')}\n\`Description:\` ${komut.help.description}\n\`Usage:\` ${komut.help.usage}`}`);
    //return knl.send(new MessageEmbed().setDescription(`\`\`\`asciidoc\n${dil == "tr" ? `= Komut Bilgi = \nAdı :: ${komut.help.isim}\nAlternatif(ler) :: ${komut.conf.aliases.join(', ')}\nAçıklama :: ${komut.help.aciklama}\nKullanım :: ${komut.help.kullanim}` : `= Command Information = \nName :: ${komut.help.name}\nAliase(s) :: ${komut.conf.aliases.join(', ')}\nDescription :: ${komut.help.description}\nUsage :: ${komut.help.usage}`}\`\`\``));
  };
  
  client.tarihHesapla = (date) => {
    const startedAt = Date.parse(date);
    var msecs = Math.abs(new Date() - startedAt);

    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
    msecs -= years * 1000 * 60 * 60 * 24 * 365;
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
    msecs -= months * 1000 * 60 * 60 * 24 * 30;
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
    msecs -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(msecs / (1000 * 60 * 60));
    msecs -= hours * 1000 * 60 * 60;
    const mins = Math.floor((msecs / (1000 * 60)));
    msecs -= mins * 1000 * 60;
    const secs = Math.floor(msecs / 1000);
    msecs -= secs * 1000;

    var string = "";
    if (years > 0) string += `${years} yıl ${months} ay`
    else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
    else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
    else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
    else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
    else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
    else if (secs > 0) string += `${secs} saniye`
    else string += `saniyeler`;

    string = string.trim();
    return `\`${string} önce\``;
  };

  client.sunucuLog = async function(guild, send) {
    let sunucu = await Server.findOne({ guildID: guild });
    if (!sunucu || !sunucu.logKanali) return;
    let kanal = client.channels.cache.get(sunucu.logKanali);
    if (!kanal || !kanal.permissionsFor(client.user).has('SEND_MESSAGES')) {
      sunucu.logKanali = null;
      sunucu.save();
      return;
    };
    kanal.send(send);
  };
  
  let kufurler = ["allahoc","allahoç","allahamk","allahaq","0r0spuc0cu","4n4n1 sk3r1m","p1c","@n@nı skrm","evladi","orsb","orsbcogu","amnskm","anaskm","oc","abaza","abazan","ag","a\u011fz\u0131na s\u0131\u00e7ay\u0131m","fuck","shit","ahmak","seks","sex","allahs\u0131z","amar\u0131m","ambiti","am biti","amc\u0131\u011f\u0131","amc\u0131\u011f\u0131n","amc\u0131\u011f\u0131n\u0131","amc\u0131\u011f\u0131n\u0131z\u0131","amc\u0131k","amc\u0131k ho\u015faf\u0131","amc\u0131klama","amc\u0131kland\u0131","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","am\u0131k","am\u0131na","amına","am\u0131nako","am\u0131na koy","am\u0131na koyar\u0131m","am\u0131na koyay\u0131m","am\u0131nakoyim","am\u0131na koyyim","am\u0131na s","am\u0131na sikem","am\u0131na sokam","am\u0131n feryad\u0131","am\u0131n\u0131","am\u0131n\u0131 s","am\u0131n oglu","am\u0131no\u011flu","am\u0131n o\u011flu","am\u0131s\u0131na","am\u0131s\u0131n\u0131","amina","amina g","amina k","aminako","aminakoyarim","amina koyarim","amina koyay\u0131m","amina koyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","amin oglu","amiyum","amk","amkafa","amk \u00e7ocu\u011fu","amlarnzn","aml\u0131","amm","ammak","ammna","amn","amna","amnda","amndaki","amngtn","amnn","amona","amq","ams\u0131z","amsiz","amsz","amteri","amugaa","amu\u011fa","amuna","anaaann","anal","analarn","anam","anamla","anan","anana","anandan","anan\u0131","anan\u0131","anan\u0131n","anan\u0131n am","anan\u0131n am\u0131","anan\u0131n d\u00f6l\u00fc","anan\u0131nki","anan\u0131sikerim","anan\u0131 sikerim","anan\u0131sikeyim","anan\u0131 sikeyim","anan\u0131z\u0131n","anan\u0131z\u0131n am","anani","ananin","ananisikerim","anani sikerim","ananisikeyim","anani sikeyim","anann","ananz","anas","anas\u0131n\u0131","anas\u0131n\u0131n am","anas\u0131 orospu","anasi","anasinin","anay","anayin","angut","anneni","annenin","annesiz","anuna","aq","a.q","a.q.","aq.","ass","atkafas\u0131","atm\u0131k","att\u0131rd\u0131\u011f\u0131m","attrrm","auzlu","avrat","ayklarmalrmsikerim","azd\u0131m","azd\u0131r","azd\u0131r\u0131c\u0131","babaannesi ka\u015far","baban\u0131","baban\u0131n","babani","babas\u0131 pezevenk","baca\u011f\u0131na s\u0131\u00e7ay\u0131m","bac\u0131na","bac\u0131n\u0131","bac\u0131n\u0131n","bacini","bacn","bacndan","bacy","bastard","b\u0131z\u0131r","bitch","biting","boner","bosalmak","bo\u015falmak","cenabet","cibiliyetsiz","cibilliyetini","cibilliyetsiz","cif","cikar","cim","\u00e7\u00fck","dalaks\u0131z","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domald\u0131","domald\u0131n","domal\u0131k","domal\u0131yor","domalmak","domalm\u0131\u015f","domals\u0131n","domalt","domaltarak","domalt\u0131p","domalt\u0131r","domalt\u0131r\u0131m","domaltip","domaltmak","d\u00f6l\u00fc","d\u00f6nek","d\u00fcd\u00fck","eben","ebeni","ebenin","ebeninki","ebleh","ecdad\u0131n\u0131","ecdadini","embesil","emi","fahise","fahi\u015fe","feri\u015ftah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","giberim","giberler","gibis","gibi\u015f","gibmek","gibtiler","goddamn","godo\u015f","godumun","gotelek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","goyiim","goyum","goyuyim","goyyim","g\u00f6t","g\u00f6t deli\u011fi","g\u00f6telek","g\u00f6t herif","g\u00f6tlalesi","g\u00f6tlek","g\u00f6to\u011flan\u0131","g\u00f6t o\u011flan\u0131","g\u00f6to\u015f","g\u00f6tten","g\u00f6t\u00fc","g\u00f6t\u00fcn","g\u00f6t\u00fcne","g\u00f6t\u00fcnekoyim","g\u00f6t\u00fcne koyim","g\u00f6t\u00fcn\u00fc","g\u00f6tveren","g\u00f6t veren","g\u00f6t verir","gtelek","gtn","gtnde","gtnden","gtne","gtten","gtveren","hasiktir","hassikome","hassiktir","has siktir","hassittir","haysiyetsiz","hayvan herif","ho\u015faf\u0131","h\u00f6d\u00fck","hsktr","huur","\u0131bnel\u0131k","ibina","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnerator","ibnesi","idiot","idiyot","imansz","ipne","iserim","i\u015ferim","ito\u011flu it","kafam girsin","kafas\u0131z","kafasiz","kahpe","kahpenin","kahpenin feryad\u0131","kaka","kaltak","kanc\u0131k","kancik","kappe","karhane","ka\u015far","kavat","kavatn","kaypak","kayyum","kerane","kerhane","kerhanelerde","kevase","keva\u015fe","kevvase","koca g\u00f6t","kodu\u011fmun","kodu\u011fmunun","kodumun","kodumunun","koduumun","koyarm","koyay\u0131m","koyiim","koyiiym","koyim","koyum","koyyim","krar","kukudaym","laciye boyad\u0131m","libo\u015f","madafaka","malafat","malak","mcik","meme","memelerini","mezveleli","minaamc\u0131k","mincikliyim","mna","monakkoluyum","motherfucker","mudik","oc","oç","ocuu","ocuun","O\u00c7","o\u00e7","o. \u00e7ocu\u011fu","o\u011flan","o\u011flanc\u0131","o\u011flu it","orosbucocuu","orospu","orospucocugu","orospu cocugu","orospu \u00e7oc","orospu\u00e7ocu\u011fu","orospu \u00e7ocu\u011fu","orospu \u00e7ocu\u011fudur","o\u00e7","orospu \u00e7ocuklar\u0131","orospudur","orospular","orospunun","orospunun evlad\u0131","orospuydu","orospuyuz","orostoban","orostopol","orrospu","oruspu","oruspu\u00e7ocu\u011fu","oruspu \u00e7ocu\u011fu","osbir","ossurduum","ossurmak","ossuruk","osur","osurduu","osuruk","osururum","otuzbir","\u00f6k\u00fcz","\u00f6\u015fex","patlak zar","penis","pezevek","pezeven","pezeveng","pezevengi","pezevengin evlad\u0131","pezevenk","pezo","pic","piç","pi\u00e7","pici","picler","pi\u00e7","pi\u00e7in o\u011flu","pi\u00e7 kurusu","pi\u00e7ler","pipi","pipi\u015f","pisliktir","porno","pussy","pu\u015ft","pu\u015fttur","rahminde","revizyonist","s1kerim","s1kerm","s1krm","sakso","saksofon","saxo","sekis","serefsiz","sevgi koyar\u0131m","sevi\u015felim","sexs","s\u0131\u00e7ar\u0131m","s\u0131\u00e7t\u0131\u011f\u0131m","s\u0131ecem","sicarsin","sie","sik","sikdi","sikdi\u011fim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikesicenin","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmi\u015f","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","siki\u015f","siki\u015fen","siki\u015fme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikko","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinbaya","siksinler","siksiz","siksok","siksz","sikt","sikti","siktigimin","siktigiminin","sikti\u011fim","sikti\u011fimin","sikti\u011fiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktim","siktimin","siktiminin","siktir","siktir et","siktirgit","siktir git","siktirir","siktiririm","siktiriyor","siktir lan","siktirolgit","siktir ol git","sittimin","sittir","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokar\u0131m","sokarim","sokarm","sokarmkoduumun","sokay\u0131m","sokaym","sokiim","soktu\u011fumunun","sokuk","sokum","soku\u015f","sokuyum","soxum","sulaleni","s\u00fclaleni","s\u00fclalenizi","s\u00fcrt\u00fck","\u015ferefsiz","\u015f\u0131ll\u0131k","taaklarn","taaklarna","tarrakimin","tasak","tassak","ta\u015fak","ta\u015f\u015fak","tipini s.k","tipinizi s.keyim","tiyniyat","toplarm","topsun","toto\u015f","vajina","vajinan\u0131","veled","veledizina","veled i zina","verdiimin","weled","weledizina","whore","xikeyim","yaaraaa","yalama","yalar\u0131m","yalarun","yaraaam","yarak","yaraks\u0131z","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraam\u0131","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarra\u011f","yarra\u011f\u0131m","yarra\u011f\u0131m\u0131","yarraimin","yarrak","yarram","yarramin","yarraminba\u015f\u0131","yarramn","yarran","yarrana","yarrrak","yavak","yav\u015f","yav\u015fak","yav\u015fakt\u0131r","yavu\u015fak","y\u0131l\u0131\u015f\u0131k","yilisik","yogurtlayam","yo\u011furtlayam","yrrak","z\u0131kk\u0131m\u0131m","zibidi","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiiin","ziksiin","zulliyetini","zviyetini"];
  let swears = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
  client.chatKoruma = async message => {
    if (!message || !message.guild || !message.member || message.author.bot || !message.content || message.guild.id === "264445053596991498" || message.author.id === client.user.id) return;
    let sunucu = await Server.findOne({ guildID: message.guild.id });
    if (!sunucu) return false;
    if (sunucu.guvenli.some(id => message.channel.id === id || message.author.id === id || message.member.roles.cache.has(id))) return;
    let mesajIcerik = message.content;
    
    if (sunucu.reklamKoruma) {
      let inv = /(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)/i;  
      if (inv.test(mesajIcerik)) {
        try {
          let invite = await client.fetchInvite(mesajIcerik);
          if (invite.guild.id !== message.guild.id) return "reklamKoruma";
        } catch(err) {
          return "reklamKoruma";
        };
      };
    };
    if (sunucu.linkKoruma) {
      let link = /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;  
      if (link.test(mesajIcerik)) return "linkKoruma";
    };
    if (sunucu.etiketKoruma && (message.mentions.users.size+message.mentions.roles.size) >= 5 || message.mentions.channels.size >= 5) return "etiketKoruma";
    if (sunucu.kufurKoruma && ((sunucu.dil == "tr" && kufurler.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(mesajIcerik))) || (sunucu.dil != "tr" && swears.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(mesajIcerik))))) return "kufurKoruma";
    if (sunucu.filtreKelimeler.filter(f => f.length >= 0).some(word => new RegExp("(\\b)+(" + word + ")+(\\b)"
    
    
    , "gui").test(mesajIcerik))) return "filtreKelimeler";
    if (sunucu.capsKoruma && mesajIcerik.length > 5) {
      let büyükHarfSayısı = ((mesajIcerik.match(/[A-ZĞÇÖIÜ]/gm) || []).length);
      if ((büyükHarfSayısı / mesajIcerik.length) >= 0.7) return "capsKoruma";
    };
    if (sunucu.emojiSpamKoruma) {
      let nativeEmojisRegExp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      let customEmojisRegExp = /<(?:a)?:[a-z0-9_-]{1,256}:[0-9]{16,19}>/gi;
      let nativeEmojis = message.content.match(nativeEmojisRegExp) || [];
      let customEmojis = message.content.match(customEmojisRegExp) || [];
      let emojis = nativeEmojis.concat(customEmojis);
      let cleanMessage = message.content.replace(nativeEmojisRegExp, '');
      cleanMessage = cleanMessage.replace(customEmojisRegExp, '');
      cleanMessage = cleanMessage.trim();
      if(emojis.length > 5) {
        let emojiPercentage = emojis.length / (cleanMessage.length + emojis.length) * 100;
        if (emojiPercentage > 50) return "emojiSpamKoruma";
      };
    };
    return false;
  };
  client.alfabe = ['a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'h', 'ı', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z', 'q', 'w', 'x'];
  client.noktalama = ['!', '+', '%', '&', '/', '=', ',', '?', '$', '>', '.', '-', ';', '_'];
  client.botTemizleme = async message => {
    let sunucu = await Server.findOne({ guildID: message.guild.id });
    if (!sunucu) return false;
    let botTemizleyiciKanallari = sunucu.botTemizleyiciKanallari || [];
    let mesajIcerik = message.content;
    let guvenli = sunucu.guvenli || [];
    if (message.author.id !== client.user.id && botTemizleyiciKanallari.some(kanal => message.channel.id === kanal)) {
      if (message.author.bot && !guvenli.some(id => message.author.id === id || message.member.roles.cache.has(id))) return true;
      if (mesajIcerik && mesajIcerik.length > 3 && client.noktalama.some(nokta => client.alfabe.some(alfa => mesajIcerik.toLowerCase().startsWith(nokta+alfa) || mesajIcerik.toLowerCase().startsWith(alfa+nokta) || mesajIcerik.toLowerCase().startsWith(nokta+nokta+alfa)))) return true;
    };
    return false;
  };

  var uyari = {};
  var uyariMsj = new Set();
  client.ihlalIslem = async function(message, sebep, puan) {
    if (message && message.deletable) message.delete({ timeout: 100, reason: sebep });
    let sunucu = await Server.findOne({ guildID: message.guild.id }) || {};
    let dil = sunucu.dil || 'en';
    if(!uyariMsj.has(message.channel.id)) {
      message.channel.send(new MessageEmbed().setColor(message.member.displayHexColor).setDescription(`${message.author} ${dil == "tr" ? `**${sebep.toLowerCase()}** içerikli mesaj yasak!` : `Message with **${sebep.toLowerCase()}** content is forbidden!`}`)).then(x => x.delete({ timeout: 5000 }));
      uyariMsj.add(message.channel.id);
      setTimeout(() => { uyariMsj.delete(message.channel.id) }, 5000);
    };
    uyari[message.author.id] = (uyari[message.author.id] ? Number(uyari[message.author.id]) : 0)+Number(puan);
    await client.sunucuLog(message.guild.id, new MessageEmbed().setColor("BLACK").setTimestamp().setFooter(client.users.cache.get(client.ayar.sahip).tag, client.user.avatarURL({ dynamic: true, size: 2048 })).setTitle(sebep).setDescription(dil == "tr" ? `${message.author} üyesi **${sebep.toLowerCase()}** içeren bir mesaj attı, mesajı silindi!\n\`Mesaj İçeriği:\` ${(message.content).length > 1000 ? "Fazla uzun olduğu için gösterilemiyor!" : message.content}` : `${message.author} sent message with **${sebep.toLowerCase()}** content, message deleted!\n\`Message Content:\` ${(message.content).length > 1000 ? "Cannot be shown because it is too long!" : message.content}`));
    await client.ihlalCeza(message.guild.id, message.author.id);
    setTimeout(() => {
      if(uyari[message.author.id] && Number(uyari[message.author.id])-Number(puan) >= 0) uyari[message.author.id] = (uyari[message.author.id] ? Number(uyari[message.author.id]) : 0)-Number(puan);
    }, 10*60*1000);
  };
  var ownerBildiri = new Set();
  client.ihlalCeza = async function (guildID, uyeID) {
    let sunucuVeri = await Server.findOne({ guildID: guildID }) || {};
    let sunucu = client.guilds.cache.get(guildID);
    let dil = sunucuVeri.dil || 'en';
    let cezaSayi = sunucuVeri.ihlalCezaSayi || 10;
    if(uyari[uyeID] >= cezaSayi && uyeID !== sunucu.ownerID) {
      if (sunucu.roles.cache.has(sunucuVeri.muteRolu)) {
       let uye = sunucu.members.cache.get(uyeID);
        uye.roles.add(sunucuVeri.muteRolu);
        uyari[uyeID] = 0;
        let cezaSure = sunucuVeri.ihlalCezaSure || 10;
        await client.sunucuLog(guildID, new MessageEmbed().setColor("BLACK").setTimestamp().setFooter(client.users.cache.get(client.ayar.sahip).tag, client.user.avatarURL({ dynamic: true, size: 2048 })).setTitle(dil == "tr" ? "Üye Cezalandırıldı!" : "Member Punished!").setDescription(dil == "tr" ? `${uye} üyesi chat kurallarını fazla ihlal ettiğinden dolayı **${cezaSure} dakika** boyunca susturuldu!` : `${uye} has been muted for **${cezaSure} minutes** for violating chat rules.`).addField((dil == "tr" ? "Bilgileri" : "Informations"), (dil == "tr" ? `Takma Adı: ${uye.nickname ? uye.nickname : "Yok"}\nKullanıcı Adı: ${uye.user.tag}\nID: ${uye.user.id}\nSunucuya Katılma: ${client.tarihHesapla(uye.joinedAt)}\nHesap Açılış: ${client.tarihHesapla(uye.user.createdAt)}` : `Nickname: ${uye.nickname ? uye.nickname : "Not found!"}\nUsername: ${uye.user.tag}\nID: ${uye.user.id}`)));
        try { uye.send(dil == "tr" ? `**${sunucu.name}** adlı sunucuda chat kurallarını fazla ihlal ettiğin için **${cezaSure} dakika** boyunca susturuldun!\n**${cezaSure} dakika** sonra susturulman kalkmazsa sunucu yetkililerine ulaş.` : `You has been muted on **${sunucu.name}** server for **${cezaSure} minutes** for violating chat rules!\nIf your mute does not disappear after **${cezaSure} minutes**, tell server officials.`); } catch(err) { };
        setTimeout(() => {
          uye.roles.remove(sunucuVeri.muteRolu);
        }, cezaSure*60*1000);
        return; 
      } else {
        ownerBildiri.add(sunucu.ownerID);
        if (!ownerBildiri.has(sunucu.ownerID)) try { sunucu.owner.send(dil == "tr" ? `Sunucunda chat kuralları ihlal ediliyor ve mute rolü ayarlanmış değil! Mute rolünü ayarlaman gerek. (\`${sunucu.name}\`)\n${client.ayar.prefix}mute-rolü <rol>` : `Someone is violating the chat rules on your server and your server mute role is not set! You should set the mute role. (\`${sunucu.name}\`)\n${client.ayar.prefix}mute-role <role>`); } catch(err) { };
        return;
      };
    };
  };
};