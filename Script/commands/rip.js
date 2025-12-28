module.exports.config = {
  'name': "rip",
  'version': "1.0.1",
  'hasPermssion': 0x0,
  'credits': "SUJON",
  'description': "scooby doo template memes",
  'commandCategory': "Picture",
  'usages': "...",
  'cooldowns': 0x5,
  'dependencies': {
    'fs-extra': '',
    'axios': '',
    'canvas': '',
    'jimp': '',
    'node-superfetch': ''
  }
};
module.exports.circle = async _0xe24d2d => {
  const _0x463cc8 = global.nodemodule.jimp;
  _0xe24d2d = await _0x463cc8.read(_0xe24d2d);
  _0xe24d2d.circle();
  return await _0xe24d2d.getBufferAsync("image/png");
};
module.exports.run = async ({
  event: _0x2af5a4,
  api: _0x44f236,
  args: _0x43c947,
  Users: _0x3bbafc
}) => {
  try {
    const _0x3f0270 = global.nodemodule.canvas;
    const _0x9450bc = global.nodemodule["node-superfetch"];
    const _0x1f3438 = global.nodemodule["fs-extra"];
    var _0x538d45 = __dirname + "/cache/damma.jpg";
    var _0x4e3cd3 = Object.keys(_0x2af5a4.mentions)[0] || _0x2af5a4.senderID;
    const _0x1e9b6b = _0x3f0270.createCanvas(500, 670);
    const _0x574920 = _0x1e9b6b.getContext('2d');
    const _0x23bf4d = await _0x3f0270.loadImage("https://i.postimg.cc/QM9WT7yt/IMG-20251212-223947.jpg");
    var _0x57e1e7 = await _0x9450bc.get("https://graph.facebook.com/" + _0x4e3cd3 + "/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662");
    _0x57e1e7 = await this.circle(_0x57e1e7.body);
    _0x574920.drawImage(_0x23bf4d, 0, 0, _0x1e9b6b.width, _0x1e9b6b.height);
    _0x574920.drawImage(await _0x3f0270.loadImage(_0x57e1e7), 30, 469, 178, 178);
    const _0x4117f5 = _0x1e9b6b.toBuffer();
    _0x1f3438.writeFileSync(_0x538d45, _0x4117f5);
    _0x44f236.sendMessage({
      'attachment': _0x1f3438.createReadStream(_0x538d45, {
        'highWaterMark': 131072
      }),
      'body': "সব কয়টা বলদ\nমাথায় গোবর-গু ছাড়া কিছু নাই😁😁😁\nCREATOR ━➢ SUJON-BOSS"
    }, _0x2af5a4.threadID, () => _0x1f3438.unlinkSync(_0x538d45), _0x2af5a4.messageID);
  } catch (_0x4a183c) {
    _0x44f236.sendMessage(_0x4a183c.stack, _0x2af5a4.threadID);
  }
};