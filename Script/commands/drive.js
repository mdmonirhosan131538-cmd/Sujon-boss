const axios = require('axios');

module.exports.config = {
 name: "drive",
 version: "0.0.1",
 hasPermission: 2,
 credits: "ArYAN",
 description: "Upload video or media to Google Drive and return shareable URL.",
 commandCategory: "utility",
 cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
 let inputUrl = null;

 if (event.messageReply?.attachments?.length > 0) {
 inputUrl = event.messageReply.attachments[0].url;
 } else if (args.length > 0) {
 inputUrl = args[0];
 }

 if (!inputUrl) {
 return api.sendMessage(
 "❌ | Please reply to a media message or provide a valid media URL.",
 event.threadID,
 event.messageID
 );
 }

 try {
 const apikey = "ArYAN";
 const apiURL = `https://aryan-xyz-google-drive.vercel.app/drive?url=${encodeURIComponent(inputUrl)}&apikey=${apikey}`;
 const res = await axios.get(apiURL);

 const data = res.data || {};
 const driveLink = data.driveLink || data.driveLIink;

 if (driveLink) {
 const successMsg = `✅ make by Sujon-Boss| File successfully uploaded to Google Drive!\n\n🔗 Drive URL: ${driveLink}`;
 return api.sendMessage(successMsg, event.threadID, event.messageID);
 }

 return api.sendMessage(
 `❌ | Failed to upload the file.\n${data.error || "No additional information available."}`,
 event.threadID,
 event.messageID
 );

 } catch (error) {
 console.error("Google Drive Upload Error:", error.message);
 return api.sendMessage(
 "❌ | An unexpected error occurred during upload. Please try again later.",
 event.threadID,
 event.messageID
 );
 }
};