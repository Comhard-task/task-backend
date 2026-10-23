const bcrypt = require('bcryptjs');
const config = require('../config/config');

class Hasher {
  static async generateHash(stringToHash) {
    const salt = await bcrypt.genSalt(config.saltRounds);
    return bcrypt.hash(stringToHash, salt);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Hasher;
