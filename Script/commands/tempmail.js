const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "tempmail",
  version: "3.0.0",
  hasPermission: 0,
  credits: "SUJON",
  description: "প্রতি ইউজারের জন্য আলাদা temp ইমেইল তৈরি, ইনবক্স চেক ও অটো OTP ক্যাচ",
  commandCategory: "utility",
  usages: ["tempmail", "tempmail checkmail", "tempmail otp"],
  cooldowns: 5
};

const userMailFolder = path.join(__dirname, 'tempmail_data');
if (!fs.existsSync(userMailFolder)) fs.mkdirSync(userMailFolder);

// Polling ফাংশন: OTP আসা পর্যন্ত চেক করবে
async function fetchOtpWithPolling(emailId, attempts = 12, intervalMs = 5000) {
  const otpRegex = /\b\d{4,8}\b/;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await axios.get(`https://smstome.com/api/email-messages?email_id=${encodeURIComponent(emailId)}`);
      const messages = res.data.data || [];
      for (let m of messages) {
        const text = ((m.subject || '') + ' ' + (m.from_name || '') + ' ' + (m.message || '') + ' ' + (m.preview || ''));
        const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const match = clean.match(otpRegex);
        if (match) return match[0];
      }
    } catch (e) {
      console.error('polling error', e.message || e);
    }
    await new Promise(res => setTimeout(res, intervalMs)); // wait
  }
  return null;
}

module.exports.run = async function ({ api, event, args }) {
  const userID = event.senderID;
  const threadID = event.threadID;
  const userFile = path.join(userMailFolder, `${userID}.json`);

  // ========= OTP (Polling) =========
  if (args[0] === "otp") {
    if (!fs.existsSync(userFile)) {
      return api.sendMessage("❌ আগে একটি temp ইমেইল তৈরি করুন: tempmail", threadID);
    }

    const { email, id } = JSON.parse(fs.readFileSync(userFile));
    api.sendMessage(`⏳ ${email} এ OTP আসা পর্যন্ত অপেক্ষা করা হচ্ছে...`, threadID);

    const otp = await fetchOtpWithPolling(id, 12, 5000); // 12 বার × 5 সেকেন্ড = 1 মিনিট
    if (otp) {
      return api.sendMessage(`🔑 আপনার OTP হলো: ${otp}\n\n📨 ইমেইল: ${email}`, threadID);
    } else {
      return api.sendMessage(`📭 ${email} এ এখনো কোনো OTP পাওয়া যায়নি। আবার চেষ্টা করুন।`, threadID);
    }
  }

  // ========= CHECKMAIL =========
  if (args[0] === "checkmail") {
    if (!fs.existsSync(userFile)) {
      return api.sendMessage("❌ আগে একটি temp ইমেইল তৈরি করুন: tempmail", threadID);
    }

    try {
      const { email, id } = JSON.parse(fs.readFileSync(userFile));
      const res = await axios.get(`https://smstome.com/api/email-messages?email_id=${encodeURIComponent(id)}`);
      const messages = res.data.data;

      if (messages.length === 0) {
        return api.sendMessage(`📭 ${email} এ এখনো কোনো মেইল আসেনি। পরে আবার চেষ্টা করুন।`, threadID);
      }

      const first = messages[0];
      const from = first.from_name;
      const subject = first.subject;
      const msg = first.message || "বার্তা নেই";

      // OTP detect (সংখ্যা only)
      const otpMatch = msg.match(/\b\d{4,8}\b/);

      if (otpMatch) {
        return api.sendMessage(`🔑 OTP পাওয়া গেছে: ${otpMatch[0]}\n\n👤 প্রেরক: ${from}\n📌 বিষয়: ${subject}\n📨 ইমেইল: ${email}`, threadID);
      } else {
        return api.sendMessage(`📧 নতুন মেইল:\n👤 প্রেরক: ${from}\n📌 বিষয়: ${subject}\n💬 বার্তা: ${msg}`, threadID);
      }

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ মেইল চেক করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।", threadID);
    }
  }

  // ========= CREATE NEW TEMPMAIL =========
  if (fs.existsSync(userFile)) {
    const { email } = JSON.parse(fs.readFileSync(userFile));
    return api.sendMessage(`✅ আপনি আগেই একটি temp ইমেইল তৈরি করেছেন:\n📨 ${email}\n\nℹ️ নতুন মেইল পেতে লিখুন: tempmail checkmail`, threadID);
  }

  try {
    const res = await axios.get('https://smstome.com/api/get-random-email?device_id=QQ3A.200705.002');
    const data = res.data.data;

    const email = data.email;
    const id = data.id;

    fs.writeFileSync(userFile, JSON.stringify({ email, id }));

    api.sendMessage(`✅ আপনার নতুন temp ইমেইল তৈরি করা হয়েছে:\n📨 ${email}\n🆔 Mail ID: ${id}\n\nℹ️ মেইল পেতে লিখুন: tempmail checkmail\n👉 সরাসরি OTP ধরতে লিখুন: tempmail otp`, threadID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ ইমেইল তৈরি করতে ব্যর্থ। একটু পরে আবার চেষ্টা করুন।", threadID);
  }
};