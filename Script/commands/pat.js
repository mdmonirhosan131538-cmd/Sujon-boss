const axios = require('axios');
const fs = require("fs");
const path = require("path");

module.exports.config = {
 name: "pat",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SUJON",
 description: "Pat your tagged friend with a cute anime gif",
 commandCategory: "anime",
 usages: "pat @mention",
 cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
 const mention = Object.keys(event.mentions)[0];
 if (!mention) return api.sendMessage("⚠️ দয়া করে কাউকে tag করো!", event.threadID, event.messageID);

 const tag = event.mentions[mention].replace("@", "");

 try {
 const res = await axios.get("https://nekos.life/api/v2/img/pat"); // trusted alternative API
 const imageUrl = res.data.url;
 const ext = path.extname(imageUrl).split(".")[1]; // get file extension like .gif or .png

 const filePath = path.join(__dirname, `cache/pat.${ext}`);
 const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

 api.setMessageReaction("✅", event.messageID, () => {}, true);

 api.sendMessage({
 body: `🤗 Pats, ${tag}!`,
 mentions: [{
 tag: tag,
 id: mention
 }],
 attachment: fs.createReadStream(filePath)
 }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

 } catch (err) {
 console.error(err);
 api.sendMessage("❌ GIF আনতে সমস্যা হয়েছে। আবার চেষ্টা করো!", event.threadID, event.messageID);
 }
};