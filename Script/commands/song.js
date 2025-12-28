const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 🔗 Base API URL Loader
const baseApiUrl = async () => {
 try {
 const base = await axios.get(
 `https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json`
 );
 return base.data.api;
 } catch (err) {
 console.log("API URL Error:", err.message);
 return "https://api.heckerman06.repl.co/api"; // fallback API
 }
};

module.exports.config = {
 name: "sing",
 version: "3.0.0",
 aliases: ["vid", "ytvideo"],
 credits: "SUJON",
 countDown: 5,
 hasPermssion: 0,
 description: "Download video from YouTube",
 commandCategory: "media",
 usages: "{pn} [<video name>|<video link>]",
 usePrefix: true
};

// 📌 Main command
module.exports.run = async ({ api, args, event }) => {
 const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
 
 // ▶ Direct YouTube link
 if (checkurl.test(args[0])) {
 const match = args[0].match(checkurl);
 const videoID = match ? match[1] : null;
 
 if (!videoID) {
 return api.sendMessage("❌ Invalid YouTube URL", event.threadID, event.messageID);
 }
 
 return downloadVideo(api, event, videoID);
 }
 
 // ▶ Keyword search
 if (args.length === 0) {
 return api.sendMessage(
 "⚠️ Please provide a search term or YouTube link\nExample: /video song name",
 event.threadID,
 event.messageID
 );
 }
 
 let keyWord = args.join(" ");
 keyWord = keyWord.includes("?feature=share") 
 ? keyWord.replace("?feature=share", "") 
 : keyWord;
 
 const maxResults = 5;
 let result;
 
 try {
 const apiUrl = await baseApiUrl();
 console.log("Using API URL:", apiUrl);
 
 const searchUrl = `${apiUrl}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`;
 console.log("Search URL:", searchUrl);
 
 const response = await axios.get(searchUrl, { timeout: 10000 });
 result = response.data.slice(0, maxResults);
 
 console.log("Search results:", result.length);
 
 } catch (err) {
 console.log("Search error:", err.message);
 return api.sendMessage(
 "❌ Search failed. Please try another keyword or use direct link.",
 event.threadID,
 event.messageID
 );
 }
 
 if (!result || !result.length) {
 return api.sendMessage(
 "⭕ No results found for: " + keyWord,
 event.threadID,
 event.messageID
 );
 }
 
 // ▶ Prepare search result message
 let msg = "🎬 Search Results:\n\n";
 result.forEach((info, i) => {
 msg += `${i + 1}. ${info.title || 'No title'}\n`;
 if (info.time) msg += `⏱️ ${info.time} | `;
 if (info.channel && info.channel.name) msg += `📺 ${info.channel.name}`;
 msg += "\n\n";
 });
 
 msg += "➡ Reply with a number to download video";
 
 api.sendMessage(
 {
 body: msg
 },
 event.threadID,
 (err, info) => {
 if (err) {
 console.log("Send message error:", err);
 return;
 }
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 result
 });
 },
 event.messageID
 );
};

// 📌 Handle Reply
module.exports.handleReply = async ({ event, api, handleReply }) => {
 try {
 const { result } = handleReply;
 const choice = parseInt(event.body);
 
 if (isNaN(choice) || choice < 1 || choice > result.length) {
 return api.sendMessage(
 `❌ Please reply with a number between 1 and ${result.length}`,
 event.threadID,
 event.messageID
 );
 }
 
 const infoChoice = result[choice - 1];
 const videoID = infoChoice.id || infoChoice.videoId;
 
 if (!videoID) {
 return api.sendMessage("❌ No video ID found", event.threadID, event.messageID);
 }
 
 await api.unsendMessage(handleReply.messageID);
 await downloadVideo(api, event, videoID, infoChoice.title);
 
 } catch (err) {
 console.error("HandleReply error:", err);
 api.sendMessage(
 "❌ Error processing your request",
 event.threadID,
 event.messageID
 );
 }
};

// 📥 Download video function
async function downloadVideo(api, event, videoID, videoTitle = null) {
 try {
 // Show processing message
 const processingMsg = await api.sendMessage(
 "⏳ Getting video information...",
 event.threadID,
 event.messageID
 );
 
 const apiUrl = await baseApiUrl();
 
 // Try multiple API endpoints
 const endpoints = [
 `${apiUrl}/ytDl3?link=${videoID}&format=mp4`,
 `${apiUrl}/ytdl?url=https://youtu.be/${videoID}`,
 `https://api.heckerman06.repl.co/api/ytdl?url=https://youtu.be/${videoID}`
 ];
 
 let videoData = null;
 let lastError = null;
 
 for (const endpoint of endpoints) {
 try {
 console.log("Trying endpoint:", endpoint);
 const response = await axios.get(endpoint, { timeout: 15000 });
 
 if (response.data && (response.data.downloadLink || response.data.links)) {
 videoData = response.data;
 console.log("Success with endpoint:", endpoint);
 break;
 }
 } catch (err) {
 lastError = err;
 console.log("Endpoint failed:", endpoint, err.message);
 continue;
 }
 }
 
 if (!videoData) {
 await api.unsendMessage(processingMsg.messageID);
 return api.sendMessage(
 "❌ Could not fetch video data. API might be down.",
 event.threadID,
 event.messageID
 );
 }
 
 const title = videoTitle || videoData.title || "YouTube Video";
 const downloadLink = videoData.downloadLink || 
 (videoData.links && videoData.links.find(l => l.quality === "720p" || l.quality === "360p")?.url);
 
 if (!downloadLink) {
 await api.unsendMessage(processingMsg.messageID);
 return api.sendMessage(
 "❌ No download link available for this video",
 event.threadID,
 event.messageID
 );
 }
 
 await api.unsendMessage(processingMsg.messageID);
 
 // Downloading message
 const downloadingMsg = await api.sendMessage(
 `📥 Downloading video...\n\n` +
 `🎬 ${title}\n` +
 `⏳ Please wait, this may take a moment...`,
 event.threadID
 );
 
 // Download video
 const videoPath = `video_${Date.now()}.mp4`;
 
 try {
 console.log("Downloading from:", downloadLink);
 const response = await axios({
 method: 'GET',
 url: downloadLink,
 responseType: 'stream',
 timeout: 300000 // 5 minutes
 });
 
 const writer = fs.createWriteStream(videoPath);
 response.data.pipe(writer);
 
 await new Promise((resolve, reject) => {
 writer.on('finish', resolve);
 writer.on('error', reject);
 });
 
 // Check file size
 const stats = fs.statSync(videoPath);
 const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
 
 if (stats.size === 0) {
 fs.unlinkSync(videoPath);
 throw new Error("Downloaded file is empty");
 }
 
 // File size limit (50MB for Facebook)
 if (stats.size > 50 * 1024 * 1024) {
 fs.unlinkSync(videoPath);
 await api.unsendMessage(downloadingMsg.messageID);
 return api.sendMessage(
 `❌ Video too large (${fileSizeMB}MB). Facebook limit is 50MB.`,
 event.threadID,
 event.messageID
 );
 }
 
 await api.unsendMessage(downloadingMsg.messageID);
 
 // Send video
 await api.sendMessage(
 {
 body: `✅ Video Downloaded!\n\n` +
 `🎬 ${title}\n` +
 `💾 Size: ${fileSizeMB} MB\n` +
 `🎉 Enjoy!`,
 attachment: fs.createReadStream(videoPath)
 },
 event.threadID,
 (err) => {
 // Cleanup
 try {
 if (fs.existsSync(videoPath)) {
 fs.unlinkSync(videoPath);
 }
 } catch (e) {
 console.log("Cleanup error:", e);
 }
 
 if (err) {
 console.log("Send video error:", err);
 }
 }
 );
 
 } catch (downloadErr) {
 console.log("Download error:", downloadErr);
 
 // Cleanup
 if (fs.existsSync(videoPath)) {
 fs.unlinkSync(videoPath);
 }
 
 await api.unsendMessage(downloadingMsg.messageID);
 
 return api.sendMessage(
 `❌ Download failed: ${downloadErr.message}\n\n` +
 `Try using a shorter video or check the URL.`,
 event.threadID,
 event.messageID
 );
 }
 
 } catch (err) {
 console.error("Video download error:", err);
 
 api.sendMessage(
 `❌ Error: ${err.message || "Unknown error occurred"}`,
 event.threadID,
 event.messageID
 );
 }
}