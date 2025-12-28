module.exports.config = {
  'name': "kiss",
  'version': "2.0.0",
  'hasPermssion': 0x0,
  'credits': "SUJON",
  'description': "Kiss the person you want",
  'commandCategory': "Love",
  'usages': "kiss [tag]",
  'cooldowns': 0x5,
  'dependencies': {
    'axios': '',
    'fs-extra': '',
    'path': '',
    'jimp': ''
  }
};
module.exports.onLoad = async () => {
  const {
    resolve: _0x1ba2eb
  } = global.nodemodule.path;
  const {
    existsSync: _0x4385e1,
    mkdirSync: _0x52cf7b
  } = global.nodemodule["fs-extra"];
  const {
    downloadFile: _0x3435b0
  } = global.utils;
  const _0x28724b = __dirname + "/cache/";
  const _0x57f163 = _0x1ba2eb(__dirname, "cache", "hon0.jpeg");
  if (!_0x4385e1(_0x28724b + '')) {
    _0x52cf7b(_0x28724b, {
      'recursive': true
    });
  }
  if (!_0x4385e1(_0x57f163)) {
    await _0x3435b0("https://i.imgur.com/j96ooUs.jpeg", _0x57f163);
  }
};
async function makeImage({
  one: _0x1a91fb,
  two: _0x2d40f4
}) {
  const _0x2269ba = global.nodemodule["fs-extra"];
  const _0x827574 = global.nodemodule.path;
  const _0x208cd9 = global.nodemodule.axios;
  const _0x3334d1 = global.nodemodule.jimp;
  const _0x3745ed = _0x827574.resolve(__dirname, "cache");
  let _0x37ab03 = await _0x3334d1.read(_0x3745ed + "/hon0.jpeg");
  let _0x1ebe32 = _0x3745ed + ("/hon0_" + _0x1a91fb + '_' + _0x2d40f4 + ".jpeg");
  let _0x4128f2 = _0x3745ed + ("/avt_" + _0x1a91fb + ".png");
  let _0x59f451 = _0x3745ed + ("/avt_" + _0x2d40f4 + ".png");
  let _0x2ae88d = (await _0x208cd9.get("https://graph.facebook.com/" + _0x1a91fb + "/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", {
    'responseType': "arraybuffer"
  })).data;
  _0x2269ba.writeFileSync(_0x4128f2, Buffer.from(_0x2ae88d, "utf-8"));
  let _0x319198 = (await _0x208cd9.get("https://graph.facebook.com/" + _0x2d40f4 + "/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", {
    'responseType': "arraybuffer"
  })).data;
  _0x2269ba.writeFileSync(_0x59f451, Buffer.from(_0x319198, "utf-8"));
  let _0x18b398 = await _0x3334d1.read(await circle(_0x4128f2));
  let _0x4c1919 = await _0x3334d1.read(await circle(_0x59f451));
  _0x37ab03.resize(700, 440).composite(_0x18b398.resize(150, 150), 390, 23).composite(_0x4c1919.resize(150, 150), 115, 130);
  let _0x55c98d = await _0x37ab03.getBufferAsync("image/png");
  _0x2269ba.writeFileSync(_0x1ebe32, _0x55c98d);
  _0x2269ba.unlinkSync(_0x4128f2);
  _0x2269ba.unlinkSync(_0x59f451);
  return _0x1ebe32;
}
async function circle(_0x2c412c) {
  const _0x56c854 = require("jimp");
  _0x2c412c = await _0x56c854.read(_0x2c412c);
  _0x2c412c.circle();
  return await _0x2c412c.getBufferAsync("image/png");
}
module.exports.run = async function ({
  event: _0x4a8db7,
  api: _0xf8f2fc,
  args: _0x2342bc,
  Currencies: _0x2b2f72
}) {
  const _0x40d188 = global.nodemodule["fs-extra"];
  const _0x40de45 = Math.floor(Math.random() * 101);
  const _0x3ef05a = Math.floor(Math.random() * 100000) + 100000;
  const {
    threadID: _0x59a9a3,
    messageID: _0x1cac72,
    senderID: _0x287d35
  } = _0x4a8db7;
  const _0x344763 = Object.keys(_0x4a8db7.mentions);
  var _0x520052 = _0x344763[0];
  await _0x2b2f72.increaseMoney(_0x4a8db7.senderID, parseInt(_0x40de45 * _0x3ef05a));
  if (!_0x520052) {
    return _0xf8f2fc.sendMessage("Please tag 1 person", _0x59a9a3, _0x1cac72);
  } else {
    return makeImage({
      'one': _0x287d35,
      'two': _0x520052
    }).then(_0x25f10a => _0xf8f2fc.sendMessage({
      'body': "[❤️] The level of affection between you and that person is: " + _0x40de45 + " %\n[❤️] The two of you are blessed by BOT: " + _0x40de45 * _0x3ef05a + " $\n[❤️] Wish you happy 🍀",
      'attachment': _0x40d188.createReadStream(_0x25f10a)
    }, _0x59a9a3, () => _0x40d188.unlinkSync(_0x25f10a), _0x1cac72));
  }
};