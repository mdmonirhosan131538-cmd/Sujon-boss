module.exports.config = {
 name: "antiout",
 eventType: ["log:unsubscribe"],
 version: "0.0.1",
 credits: "SUJON",
 description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
 let data = (await Threads.getData(event.threadID)).data || {};
 if (data.antiout == false) return;
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "self-separation" : "Koi Ase Pichware Mai Lath Marta Hai?";
 if (type == "self-separation") {
  api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
   if (error) {
    api.sendMessage(`সরি বস আবালরে এড করতে পারলাম না \n ${name} এই আবালরে ব্লক করছে অথবা তার আইডিতে মেসেঞ্জার অপশন নাই তাই এড করতে পারলাম না😞 \n\n ──────·····✦·····──── \n 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ 𝐒𝐮𝐣𝐨𝐧-𝐁𝐨𝐬𝐬 `, event.threadID)
   } else api.sendMessage(`শোন, ${name} এই গ্রুপ হইলো গ্যাং! \n এখান থেকে যাইতে হইলে এডমিনের ক্লিয়ারেন্স লাগে! \nতুই পারমিশন ছাড়া লিভ নিছোস – তোকে আবার মাফিয়া স্টাইলে এড দিলাম। \n\n ── ·······✦·······──── \n 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ 𝐒𝐮𝐣𝐨𝐧-𝐁𝐨𝐬𝐬`, event.threadID);
  })
 }
}
