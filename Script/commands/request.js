const fs = require("fs");
const path = __dirname + "/SUJON/pendingdThreads.json";

module.exports.config = {
 name: "request",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SUJON",
 description: "Request for bot approval",
 commandCategory: "system",
 cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
 const threadID = event.threadID;
 let data = JSON.parse(fs.readFileSync(path));
 
 if (data.includes(threadID)) {
 return api.sendMessage("⏳ আপনার গ্রুপ ইতিমধ্যেই অনুমোদনের অপেক্ষায় রয়েছে। অনুগ্রহ করে অ্যাডমিনের উত্তর অপেক্ষা করুন।", threadID);
 }

 data.push(threadID);
 fs.writeFileSync(path, JSON.stringify(data, null, 2));

 // ⬇️ এখানে যাদের নোটিশ যাবে
 const notifyIDs = [
 "61581817361921", // Admin inbox
 "100080510397081" // Monitoring group TID
 ];

 const notice = `📥 নতুন Request এসেছে:\n\n📌 গ্রুপ ID: ${threadID}\n👤 রিকোয়েস্ট করেছেন: ${event.senderID}`;
 
 notifyIDs.forEach(id => {
 api.sendMessage(notice, id);
 });

 api.sendMessage("✅ আপনার গ্রুপটি সফলভাবে অনুমোদনের জন্য পাঠানো হয়েছে। দয়া করে অপেক্ষা করুন অ্যাডমিনের উত্তর আসা পর্যন্ত।", threadID);
};