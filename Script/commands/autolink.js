const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { alldown } = require("rx-dawonload");

module.exports.config = {
    name: "autodl",
    version: "2.1.1",
    credits: "rX Abdullah modify SUJON",
    hasPermission: 0,
    description: "Auto detect any link and ask for download confirm",
    usePrefix: false,
    commandCategory: "utility",
    usages: "",
    cooldowns: 2
};

module.exports.run = async function () {};

// -------------------------
// 🔥 Auto Detect Link
// -------------------------
module.exports.handleEvent = async function ({ api, event }) {
    const content = event.body ? event.body.trim() : "";
    if (!content.startsWith("http")) return;

    // Detect Platform
    let site = "Unknown";
    if (content.includes("youtube.com") || content.includes("youtu.be")) site = "YouTube";
    else if (content.includes("tiktok.com")) site = "TikTok";
    else if (content.includes("instagram.com")) site = "Instagram";
    else if (content.includes("facebook.com")) site = "Facebook";

    // Ask for confirmation
    api.sendMessage(
        `🔍 Platform detected: ${site}\n\n❮ React ❤ this message to start download ❯.`,
        event.threadID,
        (err, info) => {
            if (err) return;

            // Register Reaction Listener
            global.client.handleReaction = global.client.handleReaction || [];
            global.client.handleReaction.push({
                type: "autodl_confirm",
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                url: content,
                site
            });
        }
    );
};

// -------------------------
// ❤️ Reaction Handler
// -------------------------
module.exports.handleReaction = async function ({ api, event, handleReaction }) {
    try {
        if (handleReaction.type !== "autodl_confirm") return;

        // Anyone can react now
        const reaction = event.reaction;
        if (reaction !== "❤") return;

        // Edit confirmation message to show downloading
        api.editMessage(`⬇️ Downloading...`, handleReaction.messageID);

        const videoURL = handleReaction.url;
        const site = handleReaction.site;

        // Download using alldown
        const data = await alldown(videoURL);
        if (!data || !data.url) {
            api.sendMessage(`❌ Failed to fetch download link!`, event.threadID);
            return;
        }

        const title = data.title || "video";
        const dlUrl = data.url;

        // Download buffer
        const buffer = (await axios.get(dlUrl, { responseType: "arraybuffer" })).data;
        const safeTitle = title.replace(/[^\w\s]/gi, "_");
        const filePath = path.join(__dirname, "cache", `${safeTitle}.mp4`);
        fs.writeFileSync(filePath, buffer);

        // Send downloaded file
        api.sendMessage(
            {
                body: `🦋 Butterfly Bloom Music Mood
const MSG = `╭🌸🌿🦋🌿🌸╮
🎵 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲 ✅
🎧 𝗣𝗿𝗲𝘀𝗲𝗻𝘁𝗲𝗱 𝗯𝘆: ✪𝙎𝙐𝙅𝙊𝙉-𝘽𝙊𝙎𝙎✪
 ♻️ 𝗘𝗻𝗷𝗼𝘆 𝗬𝗼𝘂𝗿 𝗩𝗶𝗱𝗲𝗼 💜
╰🌸🌿🦋🌿🌸╯\n📍 Platform: ${site}\n🎬 Title: ${title}`,
                attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            () => {
                fs.unlinkSync(filePath);
                // Remove the "Downloading" message
                api.unsendMessage(handleReaction.messageID);
            }
        );

    } catch (e) {
        console.log("autodl reaction error:", e);
        api.sendMessage("❌ Download failed!", event.threadID);
    }
};
