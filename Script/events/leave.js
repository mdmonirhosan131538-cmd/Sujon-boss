module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "SUJON",
  description: "Thông báo bot hoặc người rời khỏi nhóm",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } =  global.nodemodule["path"];
  const { threadID } = event;
  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "  তোর সাহস কম নয় এখানে সুজন এর বট থাকতে তুই লিভ নিস😡😠🤬 \n\n⋆✦⎯⎯⎯⎯⎯⎯⎯⎯✦⋆\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ 𝐒𝐮𝐣𝐨𝐧-𝐁𝐨𝐬𝐬" : "তোমার এই গ্রুপে থাকার কোনো যোগ্যাতা নেই আবাল😡।\nতাই তোমার লাথি মেরে গ্রুপ থেকে বের করে দেওয়া হলো🤪। WELLCOME REMOVE🤧\n⋆✦⎯⎯⎯⎯⎯⎯⎯⎯✦⋆\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ 𝐒𝐮𝐣𝐨𝐧-𝐁𝐨𝐬𝐬";
  const path = join(__dirname, "SUJON", "leaveGif");
  const gifPath = join(path, `leave1.gif`);
  var msg, formPush

  if (existsSync(path)) mkdirSync(path, { recursive: true });

  (typeof data.customLeave == "undefined") ? msg = "ইস {name} {type} " : msg = data.customLeave;
  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);

  if (existsSync(gifPath)) formPush = { body: msg, attachment: createReadStream(gifPath) }
  else formPush = { body: msg }

  return api.sendMessage(formPush, threadID);
}
