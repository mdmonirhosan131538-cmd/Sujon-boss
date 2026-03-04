const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "4k",
    version: "1.0",
    credits: "rX by Sujon",
    description: "Upscale image to 4K using API",
    usages: "!4k (reply to a photo)",
    commandCategory: "AI",
    cooldowns: 5
};

const API_ENDPOINT = "https://free-goat-api.onrender.com/4k";

function extractImageUrl(event) {
    if (event.messageReply && event.messageReply.attachments?.length > 0) {
        const img = event.messageReply.attachments.find(
            a => a.type === "photo" || a.type === "image"
        );
        if (img?.url) return img.url;
    }
    return null;
}

module.exports.run = async function ({ api, event, args }) {

    const imageUrl = extractImageUrl(event);

    if (!imageUrl)
        return api.sendMessage("❌ Please reply to an image.", event.threadID, event.messageID);

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    let tempFile;

    try {
        const fullApiUrl = `${API_ENDPOINT}?url=${encodeURIComponent(imageUrl)}`;

        const apiRes = await axios.get(fullApiUrl);
        const data = apiRes.data;

        if (!data.image)
            throw new Error("API did not return image URL");

        const finalUrl = data.image;

        const imgStream = await axios.get(finalUrl, { responseType: "stream" });

        const cache = path.join(__dirname, "/cache");
        if (!fs.existsSync(cache)) fs.mkdirSync(cache);

        tempFile = path.join(cache, `4k_edit_${Date.now()}.jpg`);

        const writer = fs.createWriteStream(tempFile);
        imgStream.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        return api.sendMessage(
            {
                body: `> 🎀 𝐃𝐨𝐧𝐞 𝐛𝐚𝐛𝐲`,
                attachment: fs.createReadStream(tempFile)
            },
            event.threadID,
            () => fs.unlinkSync(tempFile),
            event.messageID
        );

    } catch (err) {
        console.log("4K UPSCALE ERROR:", err);

        api.setMessageReaction("❌", event.messageID, () => {}, true);

        return api.sendMessage(
            `❌ Error: ${err.message || "Something went wrong."}`,
            event.threadID,
            event.messageID
        );
    }
};
