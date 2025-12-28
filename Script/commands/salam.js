module.exports.config = {
  name: "salam",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SUJON",
  description: "auto reply to salam",
  commandCategory: "noprefix",
  usages: "assalamu alaikum",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }

};
module.exports.handleEvent = async ({ api, event, Threads,Users}) => {
var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);
    if (event.body.indexOf("assalamu alaikum")==0 || (event.body.indexOf("Assalamu alaikum")==0) || event.body.indexOf("Assalamu Alaikum")==0 ||
event.body.indexOf("Assalamualaikum")==0 ||
event.body.indexOf("assalamualaikum")==0 ||
event.body.indexOf("আসসালামু আলাইকুম")==0 ||
event.body.indexOf("ASSALAMUALAIKUM")==0 ||
event.body.indexOf("salam")==0 ||
event.body.indexOf("সালাম")==0 ||
event.body.indexOf("আসসালামু")==0) {
    const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
    var link = [
"https://i.postimg.cc/vB1ZLhXQ/received_1378256350541808.jpg","https://i.postimg.cc/85b3cn7g/07c601c7a53a50fa09c81f90f12e5b1d.jpg",
        ];
     var callback = () => api.sendMessage({body:`╭•┄┅════❁🌺❁════┅┄•╮\n    ওয়ালাইকুম আসসালাম-!!🖤💫\n╰•┄┅════❁🌺❁════┅┄•╯\n\n✿🦋༎প্রি্ঁয়্ঁ গ্রুপ্ঁ মে্ঁম্বা্ঁর্ঁ ${name}༎✨🧡\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,attachment: fs.createReadStream(__dirname + "/cache/emon.jpeg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/emon.jpeg"), event.messageID);
  const timeStart = Date.now();
  const dcm = process.uptime(); 
 var anh = Math.floor(dcm / (60 * 60));
  var la = Math.floor((dcm % (60 * 60)) / 60);
  var vt = Math.floor(dcm % 60);
      const PREFIX = config.PREFIX;
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/emon.jpeg")).on("close",() => callback());
}

  module.exports.languages = {
  "vi": {
    "on": "Use it the wrong way and then complain",
    "off": "Stupid student, used it the wrong way",
    "successText": `🧠`,
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!",
  }
    }
  module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["salam"] == "undefined" || data["salam"] == true) data["salam"] = false;
  else data["salam"] = true;
  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
api.sendMessage(`${(data["salam"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}      





    }
module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {

   };