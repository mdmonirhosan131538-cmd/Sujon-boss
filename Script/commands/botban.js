const moment = require("moment-timezone");

module.exports.config = {
  name: "otherbots",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "SUJON",
  description: "Automatically ban detected bot users, with unban support",
  commandCategory: "config",
  cooldowns: 0
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const { threadID, senderID, body } = event;
  const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A - DD/MM/YYYY");

  const botAdmins = global.config.ADMINBOT || [];
  if (senderID == api.getCurrentUserID() || botAdmins.includes(senderID)) return;

  const name = await Users.getNameUser(senderID);
  const detectPhrases = [
    "your keyboard level has reached level",
    "Command not found",
    "The command you used",
    "Please mention 1 person.",
    "Unsend this message",
    "You are unable to use bot",
    "»» NOTICE «« Update user nicknames",
    "just removed 1 Attachments",
    "message removedcontent",
    "The current preset is",
    "Here Is My Prefix",
    "just removed 1 attachment.",
    "Unable to re-add members",
    "removed 1 message content:",
    "Here's your music, enjoy!🥰",
    "Ye Raha Aapka Music, enjoy!🥰",
    "your keyboard Power level Up",
    "bot ki mc",
    "your keyboard hero level has reached level"
  ];

  if (body && detectPhrases.some(phrase => body.toLowerCase().includes(phrase.toLowerCase()))) {
    const userData = (await Users.getData(senderID)).data || {};
    userData.banned = 1;
    userData.reason = "Detected as another bot";
    userData.dateAdded = time;
    await Users.setData(senderID, { data: userData });
    global.data.userBanned.set(senderID, {
      reason: userData.reason,
      dateAdded: userData.dateAdded
    });

    const warnMessage = `⚠️ 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱 𝗕𝗢𝗧 𝗨𝘀𝗲𝗿 ⚠️\n━━━━━━━━━━━━━━━━\n👤 Name: ${name}\n🔗 UID: ${senderID}\n📅 Time: ${time}\n❌ Status: Auto Banned\n━━━━━━━━━━━━━━━━\n🔒 Reason: Suspected bot behavior`;

    await api.sendMessage(
      `🚫 ${name}, you have been detected as a bot and automatically banned to prevent spamming.`,
      threadID
    );

    for (const adminID of botAdmins) {
      api.sendMessage(warnMessage, adminID);
    }
  }
};

module.exports.run = async ({ event, api, args, Users }) => {
  const { threadID, senderID } = event;
  const botAdmins = global.config.ADMINBOT || [];

  if (args[0] === "unban") {
    if (!botAdmins.includes(senderID)) {
      return api.sendMessage("❌ Only bot admins can unban users.", threadID);
    }

    const targetUID = args[1];
    if (!targetUID || isNaN(targetUID)) {
      return api.sendMessage("❗ Usage: otherbots unban [uid]", threadID);
    }

    const userData = (await Users.getData(targetUID)).data || {};
    if (!userData.banned) {
      return api.sendMessage("✅ This user is not banned.", threadID);
    }

    delete userData.banned;
    delete userData.reason;
    delete userData.dateAdded;
    await Users.setData(targetUID, { data: userData });
    global.data.userBanned.delete(targetUID);

    return api.sendMessage(`✅ UID ${targetUID} has been successfully unbanned.`, threadID);
  }

  return api.sendMessage(
    "🛡️ This command is actively running in the background to detect and ban suspected bot accounts automatically.\n\n🔓 Admins can unban with:\n&otherbots unban [uid]",
    threadID
  );
};