module.exports.config = {
  'name': "mp3",
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'credits': "SUJON",
  'description': "convart MP4 video to MP3",
  'commandCategory': "video Convert Audio",
  'usages': "audio",
  'cooldowns': 0x5
};
module.exports.run = async function ({
  api: _0x25fa19,
  args: _0x3d91c6,
  event: _0x33c162,
  Currencies: _0x3a5627,
  Users: _0x32b9c6
}) {
  try {
    const _0x4d4a13 = require("axios");
    const _0x32fa37 = require("fs-extra");
    var _0x3ce828 = [];
    var _0x1b2f4e = _0x3d91c6.join(" ") || _0x33c162.messageReply.attachments[0].url;
    var {
      data: _0x376808
    } = await _0x4d4a13.get(_0x1b2f4e, {
      'method': "GET",
      'responseType': "arraybuffer"
    });
    _0x32fa37.writeFileSync(__dirname + "/cache/vdtoau.m4a", Buffer.from(_0x376808, "utf-8"));
    _0x3ce828.push(_0x32fa37.createReadStream(__dirname + "/cache/vdtoau.m4a"));
    var _0x3d1392 = {
      'body': "𝗖𝗼𝘃𝗲𝗿𝘁 𝗩𝗶𝗱𝗲𝗼 𝗠𝗣𝟯 🎼\n•┄┅════❁🌺❁════┅┄•\n",
      'attachment': _0x3ce828
    };
    _0x25fa19.sendMessage(_0x3d1392, _0x33c162.threadID, _0x33c162.messageID);
  } catch (_0xb045c1) {
    console.log(_0xb045c1);
  }
};