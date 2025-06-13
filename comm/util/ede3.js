const crypto = require('crypto')

const defaultKeyb64 = '2ViVcsj1iBizUSdM2OUsy/=='
function decryptPassword(passwdBase64, ...keys) {
    keys.push(defaultKeyb64)
    const keyb64 = keys[0]
    const key = Buffer.from(keyb64)
    const encryptedData = Buffer.from(passwdBase64, 'base64')
    const decipher = crypto.createDecipheriv('des-ede3', key, null)
    decipher.setAutoPadding(true) // PKCS5/PKCS7 填充
    let decrypted = decipher.update(encryptedData)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString('utf8')
}

function encryptPassword(passwd, ...keys) {
    keys.push(defaultKeyb64)
    const keyb64 = keys[0]
    const key = Buffer.from(keyb64)
    const cipher = crypto.createCipheriv('des-ede3', key, null)
    cipher.setAutoPadding(true) // PKCS5/PKCS7 填充
    let encrypted = cipher.update(passwd, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
}
function generateRandomBase64(length) {
    // Calculate the number of bytes needed for the given base64 length
    const byteLength = Math.ceil((length * 3) / 4)
    // Generate random bytes
    const randomBytes = crypto.randomBytes(byteLength)
    // Convert to base64 and slice to the desired length
    return randomBytes.toString('base64').slice(0, length)
}

// const randomBase64 = generateRandomBase64(24)
// console.log(randomBase64)

module.exports.encryptPassword = encryptPassword
module.exports.decryptPassword = decryptPassword


