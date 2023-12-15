const bcrypt = require('bcrypt')

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(password, salt)
  return newPassword
}

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}

module.exports = { hashedPassword, comparePassword }
