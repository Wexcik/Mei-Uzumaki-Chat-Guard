const fs = require("fs");
const path = require("path");
module.exports = client => {
  let dEvents = fs.readdirSync("./events/").filter(file => !fs.statSync(path.resolve("./events/" + file)).isDirectory()).filter(file => file.endsWith(".js"));
  for (let event of dEvents) {
    event = event.replace(/\.js$/i, "");
    console.log(event + " Discord Eventi yükleniyor...");
    if (event === "ready") {
      client.on(event, () => require(`../events/${event}`)(client));
    } else {
      client.on(event, require(`../events/${event}`));
    };
  };
};