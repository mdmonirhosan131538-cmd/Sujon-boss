const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "botinfo",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SUJON",
  description: "Bot info.",
  commandCategory: "system",
  cooldowns: 1,
  dependencies: {
    request: "",
    "fs-extra": "",
    axios: ""
  }
};

module.exports.run = async function({ api, event }) {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const time = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");

  const images = [
    "https://i.postimg.cc/FR6Tdrnv/received_1461582061731133.jpg",
    "https://i.postimg.cc/JnzBCPst/20250330-234834.jpg"
  ];

  const imageLink = images[Math.floor(Math.random() * images.length)];
  const filePath = __dirname + "/cache/botinfo.jpg";

  request(encodeURI(imageLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage(
        {
          body:
            "╭──────•◈•───────╮\n" +
            "  SUJON CHAT BOT  \n\n" +
            `☄️𝘽𝙊𝙏𝙉𝘼𝙈𝙀☄️ »» ${global.config.BOTNAME}\n` +
            `🌸𝙋𝙍𝙀𝙁𝙄𝙓🌸  »» ${global.config.PREFIX} ««\n\n` +
            "🥳𝙐𝙋𝙏𝙄𝙈𝙀🥳\n\n" +
            `𝑫𝑨𝑻𝑬 𝑨𝑵𝑫 𝑻𝑰𝑴𝑬 \n${time}\n\n` +
            `⚡𝘽𝙊𝙏 𝙄𝙎 𝙍𝙐𝙉𝙉𝙄𝙉𝙂⚡ \n🕛 ${hours}:${minutes}:${seconds} 🕧\n\n` +
            `𝐁𝐎𝐓 𝐅𝐎𝐑𝐊 :- https://github.com\n\n` +
            `SUJON-BOSS\n` +
            "╰──────•◈•───────╯",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
};

