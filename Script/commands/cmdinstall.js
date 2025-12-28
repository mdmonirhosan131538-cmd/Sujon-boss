const axios = require("axios");
const fs = require('fs');
const path = require("path");
const vm = require('vm');
module.exports.config = {
  'name': "install",
  'version': "1.0.1",
  'hasPermission': 0x2,
  'credits': "SUJON",
  'usePrefix': true,
  'description': "Create a new JS file with code from a link or provided code, with syntax checking.",
  'commandCategory': "utility",
  'usages': "[file name] [link/code]",
  'cooldowns': 0x5
};
module.exports.run = async ({
  message: _0x249c7b,
  args: _0x64072d,
  api: _0xbee1d2,
  event: _0x27c6a5
}) => {
  try {
    const _0x1e599e = _0x64072d[0];
    const _0x3afd13 = _0x64072d.slice(1).join(" ");
    if (!_0x1e599e || !_0x3afd13) {
      return _0xbee1d2.sendMessage("⚠️ দয়া করে একটি বৈধ ফাইল নাম এবং কোড বা লিংক দিন!", _0x27c6a5.threadID, _0x27c6a5.messageID);
    }
    if (_0x1e599e.includes('..') || path.isAbsolute(_0x1e599e)) {
      return _0xbee1d2.sendMessage("❌ অবৈধ ফাইল নাম!", _0x27c6a5.threadID, _0x27c6a5.messageID);
    }
    if (!_0x1e599e.endsWith(".js")) {
      return _0xbee1d2.sendMessage("⚠️ শুধুমাত্র .js ফাইল অনুমোদিত!", _0x27c6a5.threadID, _0x27c6a5.messageID);
    }
    let _0x43d48a;
    const _0x5ac656 = /^(http|https):\/\/[^ "]+$/;
    if (_0x5ac656.test(_0x3afd13)) {
      if (!_0x3afd13.startsWith("https://trustedsource.com/")) {
        return _0xbee1d2.sendMessage("❌ অনুমোদিত উৎস ব্যতীত কোড ডাউনলোড করা যাবে না!", _0x27c6a5.threadID, _0x27c6a5.messageID);
      }
      const _0x243f63 = await axios.get(_0x3afd13);
      _0x43d48a = _0x243f63.data;
    } else {
      _0x43d48a = _0x3afd13;
    }
    try {
      new vm.Script(_0x43d48a);
    } catch (_0x574673) {
      return _0xbee1d2.sendMessage("❌ কোডে সিনট্যাক্স ত্রুটি: " + _0x574673.message, _0x27c6a5.threadID, _0x27c6a5.messageID);
    }
    const _0x15dfe3 = path.join(__dirname, _0x1e599e);
    if (fs.existsSync(_0x15dfe3)) {
      return _0xbee1d2.sendMessage("⚠️ এই নামে ইতিমধ্যে একটি ফাইল রয়েছে। অন্য নাম দিন!", _0x27c6a5.threadID, _0x27c6a5.messageID);
    }
    fs.writeFileSync(_0x15dfe3, _0x43d48a, "utf-8");
    _0xbee1d2.sendMessage("✅ সফলভাবে সুজনের বটে ফাইল তৈরি হয়েছে: " + _0x15dfe3, _0x27c6a5.threadID, _0x27c6a5.messageID);
  } catch (_0x4febb9) {
    console.error("Error:", _0x4febb9);
    _0xbee1d2.sendMessage("❌ ফাইল তৈরি করতে একটি সমস্যা হয়েছে!", _0x27c6a5.threadID, _0x27c6a5.messageID);
  }
};