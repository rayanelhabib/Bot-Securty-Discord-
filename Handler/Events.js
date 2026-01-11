const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const eventsPath = path.join(process.cwd(), "Events");
  fs.readdirSync(eventsPath).forEach((file) => {
    if (!file.endsWith(".js")) return;
    const eventFunc = require(path.join(eventsPath, file));
    const eventName = file.split(".")[0]; // اسم الملف = اسم الحدث
    client.on(eventName, eventFunc.bind(null, client));
  });
};
