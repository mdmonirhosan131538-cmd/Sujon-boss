module.exports.config = {
  name: "listban",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "Cyber Sujon",
  description: "View lists of banned groups or users",
  commandCategory: "admin",
  usages: "[thread/user]",
  cooldowns: 5
};

module.exports.handleReply = async function ({
  api,
  Users,
  handleReply,
  event,
  Threads
}) {
  const { threadID, messageID, senderID, body } = event;
  let authorName = await Users.getNameUser(senderID);

  // শুধু যে ইউজার কমান্ড দিয়েছে সে-ই রিপ্লাই করতে পারবে
  if (parseInt(senderID) !== parseInt(handleReply.author)) return;

  let chosen = handleReply.listBanned[body - 1];
  if (!chosen) return api.sendMessage("❌ Invalid choice.", threadID, messageID);

  let cleanText = chosen.replace(/\d+\.\s*/, "");
  let id = chosen.replace(/\D/g, "").slice(1);

  switch (handleReply.type) {
    case "unbanthread": {
      const data = (await Threads.getData(id)).data || {};
      data.banned = 0;
      data.reason = null;
      data.dateAdded = null;
      await Threads.setData(id, { data });
      global.data.threadBanned.delete(id);

      api.sendMessage(
        `» Notification from Admin ${authorName} «\n\n✅ The group "${cleanText}" has been unbanned.\n\nNow the bot can be used again.`,
        id,
        () => api.sendMessage(`★★ Unban Success ★★\n\n${cleanText}`, threadID)
      );
      break;
    }

    case "unbanuser": {
      const data = (await Users.getData(id)).data || {};
      data.banned = 0;
      data.reason = null;
      data.dateAdded = null;
      await Users.setData(id, { data });
      global.data.userBanned.delete(id);

      api.sendMessage(
        `» Notification from Admin ${authorName} «\n\n✅ ${cleanText} has been removed from banlist.\n\nNow this user can continue using the bot.`,
        id,
        () => api.sendMessage(`★★ Unban Success ★★\n\n${cleanText}`, threadID)
      );
      break;
    }
  }
};

module.exports.run = async function ({ event, api, Users, args, Threads }) {
  const { threadID, messageID, senderID } = event;
  let listBanned = [];
  let i = 1;

  switch (args[0]) {
    case "thread":
    case "t":
    case "-t": {
      const threadBanned = global.data.threadBanned.keys();

      for (const tid of threadBanned) {
        let dataThread = await Threads.getData(tid);
        let threadInfo = dataThread.threadInfo || {};
        let nameT = threadInfo.threadName || "Unnamed Group";
        listBanned.push(`${i++}. ${nameT}\n🍂TID: ${tid}`);
      }

      if (listBanned.length > 0) {
        api.sendMessage(
          `📌 Currently ${listBanned.length} groups are banned:\n\n${listBanned.join(
            "\n"
          )}\n\n👉 Reply with the order number to unban.`,
          threadID,
          (err, info) => {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: senderID,
              type: "unbanthread",
              listBanned
            });
          },
          messageID
        );
      } else {
        api.sendMessage("✅ There are currently no banned groups.", threadID, messageID);
      }
      break;
    }

    case "user":
    case "u":
    case "-u": {
      const userBanned = global.data.userBanned.keys();

      for (const uid of userBanned) {
        const name =
          global.data.userName.get(uid) || (await Users.getNameUser(uid));
        listBanned.push(`${i++}. ${name}\n🍁UID: ${uid}`);
      }

      if (listBanned.length > 0) {
        api.sendMessage(
          `📌 Currently ${listBanned.length} users are banned:\n\n${listBanned.join(
            "\n"
          )}\n\n👉 Reply with the order number to unban.`,
          threadID,
          (err, info) => {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: senderID,
              type: "unbanuser",
              listBanned
            });
          },
          messageID
        );
      } else {
        api.sendMessage("✅ There are currently no banned users.", threadID, messageID);
      }
      break;
    }

    default:
      api.sendMessage(
        `❌ Wrong usage!\n\nUse:\n${global.config.PREFIX}listban thread\n${global.config.PREFIX}listban user`,
        threadID,
        messageID
      );
      break;
  }
};