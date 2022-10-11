const mongoose = require('mongoose');

const Guild = mongoose.Schema({
    guildID: String,
    dil: String,
    guvenli: Array,
    logKanali: String,
    muteRolu: String,
    ihlalCezaSayi: Number,
    ihlalCezaSure: Number,
    filtreKelimeler: Array,
    botTemizleyiciKanallari: Array,
    kufurKoruma: Boolean,
    reklamKoruma: Boolean,
    reklamBanKoruma: Boolean,
    linkKoruma: Boolean,
    capsKoruma: Boolean,
    etiketKoruma: Boolean,
    spamKoruma: Boolean,
    emojiSpamKoruma: Boolean
});

module.exports = mongoose.model("YashinuBot", Guild);