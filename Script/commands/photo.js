const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
 name: "photo",
 version: "1.0",
 credits: "Aadi Gupta",
 hasPermssion: 2,
 description: "Generate images by Dalle-3 AI",
 commandCategory: "download",
 usages: "[text]",
 cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
 const rawPrompt = event.messageReply?.body || args.join(" ");
 const prompt = rawPrompt.includes("dalle") ? rawPrompt.split("dalle")[1] : rawPrompt;
 if (!prompt) {
 return api.sendMessage("❌| Wrong format.\n✅ | Use: 17/18 years old boy/girl watching football match on tv and written Aadi and 69 on the back of his Dress, 4k", event.threadID, event.messageID);
 }

 try {
 const w = await api.sendMessage("⏳ Waiting a few seconds baby < 😽", event.threadID);
 const response = await axios.get(`https://all-image-genator-d1p.onrender.com/dipto/dalle?prompt=${encodeURIComponent(prompt)}&key=dipto008`);

 const data = response.data.imgUrls;
 if (!data || data.length === 0) {
 return api.sendMessage("❌ Empty response or no images generated.", event.threadID, event.messageID);
 }

 const dirPath = path.join(__dirname, 'dalle');
 await fs.ensureDir(dirPath);

 const diptoo = [];
 for (let i = 0; i < data.length; i++) {
 const imgUrl = data[i];
 const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
 const imgPath = path.join(dirPath, `${i + 1}.jpg`);
 await fs.outputFile(imgPath, imgResponse.data);
 diptoo.push(fs.createReadStream(imgPath));
 }

 if (w && w.messageID) await api.unsendMessage(w.messageID);
 await api.sendMessage({ body: `✅ | Your pic is ready <😘`, attachment: diptoo }, event.threadID, event.messageID);

 } catch (error) {
 console.error("Image generation error:", error);
 await api.sendMessage(`❌ Generation failed!\nError: ${error.message}`, event.threadID, event.messageID);
 }
};