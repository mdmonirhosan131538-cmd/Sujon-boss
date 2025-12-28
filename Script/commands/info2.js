const fs = require("fs-extra");
const request = require("request");
const moment = require("moment-timezone");

module.exports.config = {
  name: "info2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SUJON",
  description: "Admin and Bot info.",
  commandCategory: "info",
  cooldowns: 1,
  dependencies: {
    request: "",
    "fs-extra": "",
    axios: ""
  }
};

module.exports.run = async function({ api, event }) {
  try {
    // Uptime
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    // Current time
    const currentTime = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

    // Random image selection
    const images = [
      "https://i.postimg.cc/FR6Tdrnv/received_1461582061731133.jpg",
      "https://i.postimg.cc/JnzBCPst/20250330_234834.jpg"
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = __dirname + "/cache/juswa.jpg";

    // Download the image
    await new Promise((resolve, reject) => {
      request(encodeURI(randomImage))
        .pipe(fs.createWriteStream(imagePath))
        .on("close", resolve)
        .on("error", reject);
    });

    // Message content
    const messageBody = `
•—»✨ 𝐀𝐝𝐦𝐢𝐧 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 ✨🌺
•┄┅═════❁🌺❁═════┅┄•

𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: Islamic Chat Bot
𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧: SUJON CHAT BOT
𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫: Sujon 

•┄┅══❁ 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 ❁══┅┄•
Facebook ID: https://www.facebook.com/cybersujon86 
GitHub: https://github.com/cybersujon86 
Website: https://m.me/cybersujon86 
WhatsApp: 01813*****38

•┄┅═════❁🌺❁═════┅┄•
🌺✨ 𝐎𝐭𝐡𝐞𝐫 𝐈𝐧𝐟𝐨 ✨🌺
Bot Name: ${global.config.BOTNAME}
Bot Prefix: ${global.config.PREFIX}
Bot Owner: Sujon 
Bot Fork: https://github.com/cybersujon
YouTube: https://youtube.com/@cybersujon?si=vDIyqsB882bcVOt3

•—»✨ 𝐔𝐩𝐭𝐢𝐦𝐞
Today: ${currentTime}
Bot Running: ${hours}:${minutes}:${seconds}

Thanks for using ${global.config.BOTNAME} ｢🕋｣
`;

    // Send message
    await api.sendMessage(
      { body: messageBody, attachment: fs.createReadStream(imagePath) },
      event.threadID
    );

    // Delete cached image
    fs.unlinkSync(imagePath);

  } catch (error) {
    console.error("Error in info2 command:", error);
    api.sendMessage("❌ Failed to load bot info.", event.threadID);
  }
};