module.exports.config = {
    name: "resetexp",
    version: "1.1.0",
    hasPermssion: 2,
    credits: " Cyber Sujon",
    description: "Reset all user's exp in the group",
    commandCategory: "System",
    usages: "[reset all exp]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, Currencies }) => {
    const data = await api.getThreadInfo(event.threadID);
    let msg = "📛 𝗘𝗫𝗣 𝗥𝗘𝗦𝗘𝗧 𝗟𝗜𝗦𝗧 📛\n\n";
    let count = 0;

    for (const user of data.userInfo) {
        try {
            let currenciesData = await Currencies.getData(user.id);
            if (currenciesData !== false && typeof currenciesData.exp !== "undefined") {
                await Currencies.setData(user.id, { exp: 0 });
                msg += `✅ ${user.name} ➝ 0 exp\n`;
                count++;
            }
        } catch (e) {
            console.log(e);
        }
    }

    msg += `\n📌 মোট ${count} জন ইউজারের exp রিসেট করা হয়েছে।`;
    return api.sendMessage(msg, event.threadID);
};