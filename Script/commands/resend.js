const fs = require("fs-extra");
const axios = require("axios");

// ADMINS Array - এখানে আপনার FB UID বসানো হয়েছে
const ADMINS = ["61581817361921"];

module.exports.config = {
 name: "resend",
 version: "2.1.0",
 hasPermssion: 0,
 credits: "SUJON",
 description: "Auto resend removed messages (text, photo, attachments) to admin inbox with group name",
 commandCategory: "general",
 usages: "",
 cooldowns: 0,
 hide: true,
 dependencies: { "fs-extra": "", axios: "" }
};

module.exports.handleEvent = async function ({ event, api, Users }) {
 const { threadID, messageID, senderID, body, attachments, type } = event;

 if (!global.logMessage) global.logMessage = new Map();
 if (!global.data.botID) global.data.botID = api.getCurrentUserID();

 const threadData = global.data.threadData.get(threadID) || {};
 if ((threadData.resend === undefined || threadData.resend !== false) && senderID !== global.data.botID) {

 // মেসেজ লগ করা
 if (type !== "message_unsend") {
 global.logMessage.set(messageID, { msgBody: body, attachment: attachments });
 }

 // আনসেন্ট মেসেজ হ্যান্ডল
 if (type === "message_unsend") {
 const msg = global.logMessage.get(messageID);
 if (!msg) return;

 const userName = await Users.getNameUser(senderID);

 // গ্রুপের নাম বের করা
 const threadInfo = await api.getThreadInfo(threadID);
 const groupName = threadInfo.threadName || "Unnamed Group";

 let forwardText =
 `═════════════════════\n💬 *আনসেন্ট মেসেজ ডিটেক্টেড!*\n═════════════════════\n\n` +
 `👤 ইউজার: @${userName}\n` +
 `👥 গ্রুপ: ${groupName}\n` +
 `🆔 Thread ID: ${threadID}\n` +
 `📝 মেসেজ: ${msg.msgBody || "No text"}\n` +
 `═════════════════════`;

 // attachments handle (photo, video, audio, files)
 let attachmentsList = [];
 if (msg.attachment && msg.attachment.length > 0) {
 let count = 0;
 for (const file of msg.attachment) {
 count++;
 const extMatch = file.url.match(/\.(\w+)(?:\?|$)/);
 const ext = extMatch ? extMatch[1] : "jpg";
 const filePath = __dirname + `/cache/resend_${count}.${ext}`;
 const fileData = (await axios.get(file.url, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(filePath, Buffer.from(fileData));
 attachmentsList.push(fs.createReadStream(filePath));
 }
 }

 // send to all admins
 for (const adminID of ADMINS) {
 api.sendMessage(
 {
 body: forwardText,
 attachment: attachmentsList.length ? attachmentsList : undefined,
 mentions: [{ tag: userName, id: senderID }]
 },
 adminID
 );
 }
 }
 }
};

module.exports.languages = {
 vi: { on: "Bật", off: "Tắt", successText: "resend thành công" },
 en: { on: "on", off: "off", successText: "resend success!" }
};

module.exports.run = async function ({ api, event, Threads, getText }) {
 const { threadID, messageID } = event;
 let data = (await Threads.getData(threadID)).data || {};

 data.resend = !data.resend;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);

 return api.sendMessage(
 `${data.resend ? getText("on") : getText("off")} ${getText("successText")}`,
 threadID,
 messageID
 );
};