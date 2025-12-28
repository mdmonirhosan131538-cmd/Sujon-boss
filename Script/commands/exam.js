const fs = require("fs");
const path = require("path");

const cyberDir = path.join(__dirname, "CYBER");
const historyFile = path.join(cyberDir, "history.json");
const questionFile = path.join(cyberDir, "exam.json");

// Directory / files ensure
if (!fs.existsSync(cyberDir)) fs.mkdirSync(cyberDir);
if (!fs.existsSync(historyFile)) fs.writeFileSync(historyFile, JSON.stringify([], null, 2));
if (!fs.existsSync(questionFile)) fs.writeFileSync(questionFile, JSON.stringify([], null, 2));

module.exports.config = {
 name: "exam",
 version: "1.0.8",
 hasPermssion: 0,
 credits: "Cyber Rajib",
 description: "bot exam game",
 commandCategory: "game",
 usages: "exam",
 cooldowns: 10
};

// Active exam sessions
const userSessions = {};

// Helper: user name from event
function getUserName(event) {
 return event.senderName && event.senderName.trim() !== "" ? event.senderName : "Unknown";
}

// Shuffle function
function shuffleArray(arr) {
 let array = [...arr];
 for (let i = array.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [array[i], array[j]] = [array[j], array[i]];
 }
 return array;
}

module.exports.run = async function ({ api, event, args }) {
 const userName = getUserName(event);

 if (args[0] && args[0].toLowerCase() === "history") {
 return showHistory(api, event);
 }

 let questions = [];
 try {
 questions = JSON.parse(fs.readFileSync(questionFile));
 if (!Array.isArray(questions) || !questions.length) questions = [];
 } catch (e) {
 questions = [];
 }

 if (!questions.length) {
 return api.sendMessage("❌ কোনো প্রশ্ন পাওয়া যায়নি! CYBER/exam.json চেক করুন।", event.threadID, event.messageID);
 }

 if (userSessions[userName]) {
 return api.sendMessage("⚠️ আপনি আগে থেকেই Exam খেলছেন।", event.threadID, event.messageID);
 }

 // Shuffle Qsn (random order)
 const shuffledQuestions = shuffleArray(questions).slice(0, 10); // সর্বোচ্চ ১০টা প্রশ্ন

 // New session
 userSessions[userName] = {
 index: 0,
 score: 0,
 total: 0,
 name: userName,
 startTime: Date.now(),
 questionStart: Date.now(),
 answerTimes: [],
 questions: shuffledQuestions
 };

 sendQuestion(api, event, userName);
};

// reply handle
module.exports.handleReply = async function ({ api, event }) {
 const userName = getUserName(event);
 const session = userSessions[userName];

 if (!session) return;

 const now = Date.now();
 const elapsed = Math.floor((now - session.questionStart) / 1000);

 const userAns = event.body.trim().toUpperCase();
 const currentQ = session.questions[session.index];

 if (["A", "B", "C", "D"].includes(userAns)) {
 session.answerTimes.push(elapsed);

 if (userAns === currentQ.answer) {
 session.score += 10;
 session.total += 10;
 api.sendMessage(`✅ সঠিক উত্তর! (${elapsed} sec) | আপনার পয়েন্ট: ${session.score}`, event.threadID);
 } else {
 session.score -= 10;
 session.total += 10;
 api.sendMessage(`❌ ভুল উত্তর! (${elapsed} sec)\nসঠিক উত্তর: ${currentQ.answer}\nআপনার পয়েন্ট: ${session.score}`, event.threadID);
 }

 session.index++;
 session.questionStart = Date.now();

 if (session.index >= session.questions.length) {
 // Exam শেষ
 const totalTime = Math.floor((Date.now() - session.startTime) / 1000);
 const result = session.score >= 60 ? "Pass ✅" : "Fail ❌";

 let msg = `📘 Exam শেষ!\n\n👤 ${session.name}\nTotal Exam: ${session.total}\nExam Point: ${session.score} | Result: ${result}\nTotal Exam Time: ${formatTime(totalTime)}\n`;

 api.sendMessage(msg, event.threadID);

 saveHistory(session.name, session.total, session.score, result, session.answerTimes, totalTime);

 delete userSessions[userName];
 } else {
 sendQuestion(api, event, userName);
 }
 } else {
 api.sendMessage("⚠️ অনুগ্রহ করে A, B, C অথবা D দিন।", event.threadID);
 }
};

// প্রশ্ন পাঠানো + Auto delete
function sendQuestion(api, event, userName) {
 const session = userSessions[userName];
 const q = session.questions[session.index];

 let msg = `📖 প্রশ্ন ${session.index + 1}:\n${q.question}\n\n`;
 q.options.forEach(opt => (msg += opt + "\n"));
 msg += `\n👉 উত্তর দিন (A/B/C/D)`;

 api.sendMessage(
 msg,
 event.threadID,
 (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: userName
 });

 // ২ মিনিট পরে auto delete
 setTimeout(() => {
 api.unsendMessage(info.messageID);
 }, 2 * 60 * 1000);
 }
 }
 );
}

// History save
function saveHistory(name, total, score, result, answerTimes, totalTime) {
 let history = [];
 try {
 history = JSON.parse(fs.readFileSync(historyFile));
 if (!Array.isArray(history)) history = [];
 } catch(e) {
 history = [];
 }

 history.push({
 name,
 total,
 score,
 result,
 answerTimes,
 totalTime
 });

 fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

// History দেখানো (সব record)
function showHistory(api, event) {
 let history = [];
 try {
 history = JSON.parse(fs.readFileSync(historyFile));
 if (!Array.isArray(history)) history = [];
 } catch(e) {
 history = [];
 }

 if (!history.length) return api.sendMessage("📂 কোনো Exam History পাওয়া যায়নি!", event.threadID);

 let msg = "📜 Exam History (সব):\n\n";
 history.forEach((h, i) => {
 msg += `${i + 1}. ${h.name}\n`;
 msg += ` Total Exam: ${h.total}\n`;
 msg += ` Exam Point: ${h.score} | Result: ${h.result}\n`;
 msg += ` প্রতি প্রশ্নে সময়: ${h.answerTimes.map(t => t + "s").join(", ")}\n`;
 msg += ` মোট সময়: ${formatTime(h.totalTime)}\n\n`;
 });

 api.sendMessage(msg, event.threadID);
}

// sec → min/sec
function formatTime(sec) {
 if (sec < 60) return `${sec} second`;
 const min = Math.floor(sec / 60);
 const s = sec % 60;
 return `${min} min ${s} sec`;
}