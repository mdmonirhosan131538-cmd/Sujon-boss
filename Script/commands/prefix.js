module.exports.config = {
 name: "prefix",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Cyber Sujon",
 description: "Display the bot's prefix and owner info",
 commandCategory: "Information",
 usages: "",
 cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
 const { threadID, body } = event;
 if (!body) return;

 // Get main (global) prefix
 const mainPrefix = global.config.PREFIX || "/";
 
 // Get thread data
 let threadData = global.data.threadData.get(threadID) || {};
 let groupPrefix = threadData.PREFIX || mainPrefix;
 
 // THREAD INFO
 let threadInfo = (await Threads.getData(threadID)) || {};
 let groupName = threadInfo.threadInfo?.threadName || "Unnamed Group";

 const triggerWords = [
 "prefix","mprefix","mpre","bot prefix","what is the prefix","bot name",
 "how to use bot","bot not working","bot is offline","prefx","prfix",
 "perfix","bot not talking","where is bot","bot dead","bots dead",
 "dấu lệnh","daulenh","what prefix","freefix","what is bot","what prefix bot",
 "how use bot","where are the bots","where prefix"
 ];

 let text = body.toLowerCase();

 if (triggerWords.includes(text)) {
 return api.sendMessage(
`🌟━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
      『 𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 』
🌟━━━━━━━━━━━━━━━━━━━━━━━━━━🌟

『 𝐆𝐋𝐎𝐁𝐀𝐋 𝐏𝐑𝐄𝐅𝐈𝐗 』
➤ 𝗠𝗮𝗶𝗻 𝗽𝗿𝗲𝗳𝗶𝘅 : [ ${mainPrefix} ]
   (This is the default prefix for all groups)

『 𝐆𝐑𝐎𝐔𝐏 𝐏𝐑𝐄𝐅𝐈𝐗 』
➤ 𝗚𝗿𝗼𝘂𝗽 𝗽𝗿𝗲𝗳𝗶𝘅 : [ ${groupPrefix} ]
   (Current prefix for this group)

『 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 』
➤ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝐒𝐮𝐣𝐨𝐧 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
➤ 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻 : 𝐂𝐲𝐛𝐞𝐫 𝐒𝐮𝐣𝐨𝐧 

『 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎 』
➤ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲 : ${groupName}
➤ 𝗚𝗿𝗼𝘂𝗽 𝗜𝗗 : ${threadID}

🌟━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
      𝗧𝗵𝗮𝗻𝗸 𝗬𝗼𝘂 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴!
🌟━━━━━━━━━━━━━━━━━━━━━━━━━━🌟`,
 threadID
 );
 }
};

module.exports.run = async ({ event, api }) => {
 return api.sendMessage(
 "Type 'prefix' or similar to get the bot info including main prefix and group prefix.",
 event.threadID
 );
};