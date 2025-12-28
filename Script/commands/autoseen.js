const fs = require("fs-extra");
const pathFile = __dirname + "/cache/autoseen.txt";
if (!fs.existsSync(pathFile)) {
  fs.writeFileSync(pathFile, "false");
}
module.exports.config = {
  'name': "autoseen",
  'version': "1.0.0",
  'hasPermssion': 0x2,
  'credits': "SUJON",
  'description': "Auto seen",
  'commandCategory': "tools",
  'usages': "on/off",
  'cooldowns': 0x5
};
module.exports.handleEvent = async ({
  api: _0x4d275c,
  event: _0x48456e,
  args: _0x5c7f33
}) => {
  const _0x292c3b = fs.readFileSync(pathFile, 'utf-8');
  if (_0x292c3b == "true") {
    _0x4d275c.markAsReadAll(() => {});
  }
};
module.exports.run = async ({
  api: _0x187810,
  event: _0x5d637,
  args: _0x2d79a7
}) => {
  try {
    if (_0x2d79a7[0x0] == 'on') {
      fs.writeFileSync(pathFile, "true");
      _0x187810.sendMessage(this.config.name + " turn on successfully.", _0x5d637.threadID, _0x5d637.messageID);
    } else if (_0x2d79a7[0x0] == "off") {
      fs.writeFileSync(pathFile, 'false');
      _0x187810.sendMessage(this.config.name + " turn off successfully", _0x5d637.threadID, _0x5d637.messageID);
    } else {
      _0x187810.sendMessage("Wrong format\nUse " + global.config.PEFIX + this.config.name + " " + this.config.usages, _0x5d637.threadID, _0x5d637.messageID);
    }
  } catch (_0x31fa7e) {
    console.log(_0x31fa7e);
  }
};