const axios = require("axios");

const baseApiUrl = "https://cyber-simsim-404-apis.onrender.com/sim"; 

module.exports.config = {
 name: "pro",
 version: "6.3",
 hasPermssion: 0,
 credits: "Cyber Rajib",
 description: "question system with teaching, reply, earnings, levels & leaderboard",
 commandCategory: "chat",
 usages: "[pro | top]",
 cooldowns: 1
};

let userStats = {}; 
// { uid: { count, total, level, name } }

async function ensureUserLocal(api, uid) {
 if (!userStats[uid]) {
 userStats[uid] = { count: 0, total: 0, level: 0, name: "" };
 }
}

module.exports.run = async ({ api, event, args }) => {
 try {
 // leaderboard command
 if (args[0] === "top" || args[0] === "leaderboard") {
 const resp = await axios.get(`${baseApiUrl}/topUsers?limit=10`);
 if (!resp.data || !resp.data.users || resp.data.users.length === 0) {
 return api.sendMessage("📊 Leaderboard খালি আছে!", event.threadID, event.messageID);
 }
 const users = resp.data.users;
 let msg = "🏆 Leaderboard (Top Pro)\n\n";
 users.forEach((u,i) => {
 msg += `${i+1}. 👤 ${u.name || u.uid}\n📚 Teach: ${u.totalTeach || 0}\n💰 ${u.totalEarn || 0}$ | ⭐ Level: ${u.level || 0}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n`;
 });
 return api.sendMessage(msg, event.threadID, event.messageID);
 }

 // otherwise fetch random question + answer
 const res = await axios.get(`${baseApiUrl}/getQuestion`);
 if (!res.data || !res.data.question) {
 return api.sendMessage("❌ কোনো প্রশ্ন পাওয়া যায়নি!", event.threadID, event.messageID);
 }

 const currentQuestion = res.data.question;
 const currentAnswer = res.data.answer || "❓ Answer not found";

 // get DB total teach to show
 let totalTeach = 0;
 try {
 const teachRes = await axios.get(`${baseApiUrl}/teachCount`);
 if (teachRes.data && typeof teachRes.data.totalTeach !== "undefined") {
 totalTeach = teachRes.data.totalTeach;
 }
 } catch (e) {
 totalTeach = 0;
 }

 return api.sendMessage(
 `🧠 Question:\n${currentQuestion}\n\n💡 Answer:\n${currentAnswer}\n\n🌍 Database Total Teach: ${totalTeach}\n\n💬 Reply this message with your own answer (to teach system).`,
 event.threadID,
 (err, info) => {
 if (err) return;
 global.client.handleReply.push({
 type: "reply",
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 question: currentQuestion,
 answer: currentAnswer // ✅ সঠিক উত্তরও attach হলো
 });
 },
 event.messageID
 );
 } catch (err) {
 console.error(err);
 return api.sendMessage("⚠️ সার্ভারে সমস্যা হয়েছে!", event.threadID, event.messageID);
 }
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
 if (!(handleReply.type === "reply" && event.senderID === handleReply.author)) return;

 try {
 const answer = event.body;
 const uid = event.senderID;

 await ensureUserLocal(api, uid);

 // get user facebook name via api.getUserInfo (framework specific)
 if (!userStats[uid].name || userStats[uid].name === "") {
 try {
 const info = await api.getUserInfo(uid);
 // framework returns object keyed by id
 userStats[uid].name = info[uid]?.name || info[0]?.name || "Unknown";
 } catch {
 userStats[uid].name = "Unknown";
 }
 }

 // earnings calculation (10$ per teach)
 const earnedNow = 10;
 userStats[uid].count = (userStats[uid].count || 0) + 1;
 userStats[uid].total = (userStats[uid].total || 0) + earnedNow;
 if (userStats[uid].total > 1000000) userStats[uid].total = 1000000;
 userStats[uid].level = Math.floor(userStats[uid].total / 100);

 // call server to save the answer and include name so API can persist it
 let serverResp = null;
 try {
 serverResp = await axios.post(`${baseApiUrl}/saveAnswer`, {
 question: handleReply.question,
 correctAnswer: handleReply.answer, // ✅ সঠিক Answer ও সেভ হবে
 answer: answer, // ✅ user reply
 teacher: uid,
 name: userStats[uid].name
 });
 } catch (e) {
 console.error("saveAnswer error:", e?.response?.data || e.message);
 return api.sendMessage("আপনার উত্তর সঠিক নয় তাই সেভ করা হলোনা-!!😿🙂", event.threadID, event.messageID);
 }

 // fetch updated global totals
 let totalTeach = 0;
 try {
 const teachRes = await axios.get(`${baseApiUrl}/teachCount`);
 if (teachRes.data && typeof teachRes.data.totalTeach !== "undefined") totalTeach = teachRes.data.totalTeach;
 } catch (e) {
 totalTeach = 0;
 }

 // reply confirmation
 const msg = [
 `✅ Reply saved!`,
 `📚 Question: ${handleReply.question}`,
 `💡 Correct Answer: ${handleReply.answer}`,
 `💬 Your Answer: ${answer}`,
 ``,
 `💵 Earned this round: +${earnedNow}$`,
 `💰 Total Earned: ${userStats[uid].total}$`,
 `⭐ Level: ${userStats[uid].level}`,
 `📚 Your Total Teach: ${userStats[uid].count}`,
 `🌍 Database Total Teach: ${totalTeach}`
 ].join('\n');

 await api.sendMessage(msg, event.threadID, event.messageID);

 // send next question automatically
 try {
 const nextQ = await axios.get(`${baseApiUrl}/getQuestion`);
 if (nextQ.data && nextQ.data.question) {
 const nextMsg = `🧠 Next Question:\n${nextQ.data.question}\n\n💡 Answer:\n${nextQ.data.answer || "❓ Answer not found"}\n\n💬 Reply this message with your answer.\n\n💵 Total: ${userStats[uid].total}$\n⭐ Level: ${userStats[uid].level}\n📚 Your Teach: ${userStats[uid].count}\n🌍 Database Total Teach: ${totalTeach}`;
 return api.sendMessage(
 nextMsg,
 event.threadID,
 (err, info) => {
 if (err) return;
 global.client.handleReply.push({
 type: "reply",
 name: module.exports.config.name,
 messageID: info.messageID,
 author: uid,
 question: nextQ.data.question,
 answer: nextQ.data.answer || "❓ Answer not found"
 });
 },
 event.messageID
 );
 }
 } catch (e) { /* ignore next question error */ }

 } catch (err) {
 console.error(err);
 return api.sendMessage("❌ উত্তর সেভ করা যায়নি!", event.threadID, event.messageID);
 }
};