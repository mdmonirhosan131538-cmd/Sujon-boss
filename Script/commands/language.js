module.exports.config = {
	name: "language",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "SUJON",
	description: "Change BOT language",
	commandCategory: "System",
	usages: "[bn] [en]",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;

    switch (args[0]) {
        case "vietnames":
        case "vi":
            {
                return api.sendMessage(`Ngôn ngữ đã được chuyển sang tiếng Việt`, threadID, () => global.config.language = "vi"); 
            }
            break;
        
        case "english":
        case "en":
            {
                return api.sendMessage(`Language has been converted to English`, threadID, () => global.config.language = "en"); 
            }
            break;
    
        default:
            {
                return api.sendMessage("Syntax error, use : language [bn / en]", threadID, messageID);
            }   
            break; 
            
    }	
}