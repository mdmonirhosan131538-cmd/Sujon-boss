const { exec } = require("child_process");

module.exports.config = {
  name: "restart",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "Cyber Sujon",
  description: "Restart the bot with uptime-style loading system",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  try {
    // প্রথম মেসেজ পাঠাবে 10%
    api.sendMessage("[█░░░░░░░░░░] 10%", event.threadID, async (err, info) => {
      if (err) return console.error(err);
      let messageID = info.messageID;

      // 🔹 Steps (10 → 30 → 60 → 100)
      const steps = [
        { bar: "[███░░░░░░░░]", percent: "30%" },
        { bar: "[██████░░░░░]", percent: "60%" },
        { bar: "[██████████]", percent: "100%" }
      ];

      // Progress Animate (uptime-style editMessage)
      for (const step of steps) {
        await new Promise(r => setTimeout(r, 800)); // delay একটু বাস্তবসম্মত রাখলাম
        try {
          await api.editMessage(`${step.bar} ${step.percent}`, messageID);
        } catch (e) {
          // fallback যদি editMessage কাজ না করে
          await api.unsendMessage(messageID);
          const newMsg = await api.sendMessage(`${step.bar} ${step.percent}`, event.threadID);
          messageID = newMsg.messageID;
        }
      }

      // 🔹 Final Message
      const finalMsg = `🔄 Restarting bot...
╭─────────────────⟡
│ ✅ Please wait, bot will be 
│    back online shortly!
╰─────────────────⟡`;

      await new Promise(r => setTimeout(r, 1000));
      try {
        await api.editMessage(finalMsg, messageID);
      } catch (e) {
        await api.unsendMessage(messageID);
        await api.sendMessage(finalMsg, event.threadID);
      }

      // Bot restart করবে
      setTimeout(() => {
        exec("pm2 restart all", (error) => {
          if (error) console.error("Restart error:", error);
          process.exit(1);
        });
      }, 2000);
    });
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Restart failed.", event.threadID);
  }
};