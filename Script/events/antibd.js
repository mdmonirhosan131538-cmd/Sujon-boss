module.exports.config = {
  name: "antibd",
  eventType: ["log:user-nickname"],
  version: "0.0.1",
  credits: "SUJON",
  description: "Against changing Bot's nickname"
};

module.exports.run = async function({ api, event, Users, Threads }) {
    var { logMessageData, threadID, author } = event;
    var botID = api.getCurrentUserID();
    var { BOTNAME, ADMINBOT } = global.config;
    var { nickname } = await Threads.getData(threadID, botID);
    var nickname = nickname ? nickname : BOTNAME;
    if (logMessageData.participant_id == botID && author != botID && !ADMINBOT.includes(author) && logMessageData.nickname != nickname) {
        api.changeNickname(nickname, threadID, botID)
        var info = await Users.getData(author);
       return api.sendMessage({ body: `${info.name} -  তুই নিকনেম চেঞ্জ করতে পারবি না 😹\n শুধু আমার বস সুজন চেঞ্জ করতে পারবে🖐`}, threadID);
    }  
        }
