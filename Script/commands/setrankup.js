module.exports.config = {
    name: "setrankup",
    version: "1.0.6",
    hasPermssion: 1,
    credits: "SUJON",
    description: "Edit text/animation when new members level up",
    commandCategory: "System",
    usages: "[text <message>] | [gif <url/remove>]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "rankup");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    return;
}

module.exports.languages = {
    "vi": {
        "savedConfig": "Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:",
        "tagMember": "[Tên thành viên]",
        "tagLevel": "[Level của thành viên]",
        "gifPathNotExist": "Nhóm của bạn chưa từng cài đặt gif rankup",
        "removeGifSuccess": "Đã gỡ bỏ thành công file gif của nhóm bạn!",
        "invaildURL": "Url bạn nhập không phù hợp!",
        "internetError": "Không thể tải file vì url không tồn tại hoặc bot đã xảy ra vấn đề về mạng!",
        "saveGifSuccess": "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:"
    },
    "en": {
        "savedConfig": "Saved your config, here is preview:",
        "tagMember": "[Member's name]",
        "tagLevel": "[Member level]",
        "gifPathNotExist": "Your thread didn't set gif rankup",
        "removeGifSuccess": "Removed thread's gif!",
        "invaildURL": "Invalid url!",
        "internetError": "Can't load file because url doesn't exist or internet have some problem!",
        "saveGifSuccess": "Saved file gif, here is preview:"
    }
}

module.exports.run = async function ({ args, event, api, Threads, getText }) {
    try {
        const { existsSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];
        const { threadID, messageID } = event;
        const msg = args.slice(1).join(" ");
        var data = (await Threads.getData(threadID)).data || {};

        switch (args[0]) {
            case "text": {
                if (!msg) return api.sendMessage(`❌ Please enter a text.\n\nExample:\n${global.config.PREFIX}setrankup text 🎉 Congratulations {name}, you reached level {level}!`, threadID, messageID);
                data["customRankup"] = msg;
                global.data.threadData.set(parseInt(threadID), data);
                await Threads.setData(threadID, { data });
                return api.sendMessage(getText("savedConfig"), threadID, function () {
                    const body = msg
                        .replace(/\{name}/g, getText("tagMember"))
                        .replace(/\{level}/g, getText("tagLevel"));
                    return api.sendMessage(body, threadID);
                });
            }
            case "gif": {
                const path = join(__dirname, "cache", "rankup");
                const pathGif = join(path, `${threadID}.gif`);
                if (!msg) return api.sendMessage(`❌ Please provide gif URL or 'remove'.`, threadID, messageID);

                if (msg == "remove") {
                    if (!existsSync(pathGif)) return api.sendMessage(getText("gifPathNotExist"), threadID, messageID);
                    unlinkSync(pathGif);
                    return api.sendMessage(getText("removeGifSuccess"), threadID, messageID);
                } else {
                    if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g))
                        return api.sendMessage(getText("invaildURL"), threadID, messageID);
                    try {
                        await global.utils.downloadFile(msg, pathGif);
                    } catch (e) {
                        return api.sendMessage(getText("internetError"), threadID, messageID);
                    }
                    return api.sendMessage({ body: getText("saveGifSuccess"), attachment: createReadStream(pathGif) }, threadID, messageID);
                }
            }
            default: {
                return api.sendMessage(`⚙️ Usage:\n${global.config.PREFIX}setrankup text <message>\n${global.config.PREFIX}setrankup gif <url>\n${global.config.PREFIX}setrankup gif remove`, threadID, messageID);
            }
        }
    } catch (e) {
        console.log(e);
        return api.sendMessage(`❌ An error occurred: ${e.message}`, event.threadID, event.messageID);
    }
}