module.exports.config = {
  'name': "allah",
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'Credits': "SUJON",
  'description': "Allaha text gif",
  'commandCategory': "Text gif",
  'usages': "allah",
  'cooldowns': 0x5,
  'dependencies': {
    'request': '',
    'fs-extra': '',
    'axios': ''
  }
};
module.exports.run = async ({
  api: _0x2e1823,
  event: _0x33944e,
  args: _0x3ad267,
  client: _0xed7768,
  Users: _0x432328,
  Threads: _0x2162ce,
  __GLOBAL: _0x1f422b,
  Currencies: _0x4b946f
}) => {
  const _0x32763e = global.nodemodule.request;
  const _0x2cbe86 = global.nodemodule["fs-extra"];
  var _0x47d387 = ["https://i.postimg.cc/HL0rG8Bh/undefined-Imgur.gif","https://i.postimg.cc/fy1zSM8B/undefined-Imgur-(1).gif"];
  var _0x1ff28c = () => _0x2e1823.sendMessage({
    'body': "•—»✨ [ 𝗔𝗹𝗹𝗮𝗵 𝗚𝗜𝗙 ] ✨«—•\n•┄┅════❁🌺❁════┅┄•\n\n\n✿┼─আল্লাহু আকবর┼─✿ \n\n\n•┄┅════❁🌺❁════┅┄•",
    'attachment': _0x2cbe86.createReadStream(__dirname + "/cache/5.gif")
  }, _0x33944e.threadID, () => _0x2cbe86.unlinkSync(__dirname + "/cache/5.gif"));
  return _0x32763e(encodeURI(_0x47d387[Math.floor(Math.random() * _0x47d387.length)])).pipe(_0x2cbe86.createWriteStream(__dirname + "/cache/5.gif")).on("close", () => _0x1ff28c());
};