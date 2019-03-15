const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

function decodeJwt(token){
    return jwt.decode(token);
}

function generateToken(user, length){
    return jwt.sign({
        userId: user.id,
        role: user.role,
    }, user.secret_key, {
        subject: user.id.toString(),
        expiresIn: length || 1000 * 60 * 60 * 48, // 2 days
    });
}

function generateRandomKey(){
    return new Promise((resolve, reject) => {
        crypto.randomBytes(48, (error, buffer) => {
            if (error){
                reject(error)
            }
            resolve(buffer.toString("hex"))
        });
    });
}

async function hashPassword(password) {
    const secretKey = await generateRandomKey();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { hashedPassword, secretKey };
}

module.exports = {
    generateToken,
    hashPassword,
    generateRandomKey,
    decodeJwt,
};

