const crypto = require('crypto');

const generatePublicCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const byte = crypto.randomInt(0, chars.length);
    code += chars[byte];
  }
  return code;
};

module.exports = generatePublicCode;
