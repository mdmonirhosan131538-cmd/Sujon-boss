const chalk = require("chalk");
module.exports = (_0x4fca9b, _0x56c194) => {
  switch (_0x56c194) {
    case 'warn':
      console.log(chalk.bold.hex('#FF00FF').bold("[ Error ] » ") + _0x4fca9b);
      break;
    case 'error':
      console.log(chalk.bold.hex("#FF00FF").bold("[ Error ] »") + _0x4fca9b);
      break;
    default:
      console.log(chalk.bold.hex('#FF0000').bold(_0x56c194 + " » ") + _0x4fca9b);
      break;
  }
};
module.exports.loader = (_0x2697bc, _0x5b4185) => {
  switch (_0x5b4185) {
    case "warn":
      console.log(chalk.bold.hex("#ff334b").bold("[ SUJON-BOSS  ] » ") + _0x2697bc);
      break;
    case 'error':
      console.log(chalk.bold.hex("#b4ff33").bold("[ SUJON-BOSS ] » ") + _0x2697bc);
      break;
    default:
      console.log(chalk.bold.hex('#33ffc9').bold("[ SUJON-BOSS ] » ") + _0x2697bc);
      break;
  }
};