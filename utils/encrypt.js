const crypto = require("node:crypto");
const config = require("../config/config");

const { encryptionMethod, encryptionKey, secretKey } = config;

if (!encryptionKey || !secretKey || !encryptionMethod) {
  throw new Error("secretKey, secretIV, and ecnryptionMethod are required");
}

// Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash("sha512")
  .update(encryptionKey)
  .digest("hex")
  .slice(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update(secretKey)
  .digest("hex")
  .slice(0, 16);

// Encrypt data
function encrypt(data) {
  if (data) {
    data = data.toString();
  }
  const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
}

// Decrypt data
function decrypt(encryptedData) {
  if (encryptedData === undefined || encryptedData === null) {
    return null;
  }
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(encryptionMethod, key, encryptionIV);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  ); // Decrypts data and converts to utf8
}

function encryptField(object, fieldName) {
  const value = object.getDataValue(fieldName);
  if (value === undefined || value === null) {
    return undefined;
  }
  return encrypt(value.toString())
}

module.exports = {
  encrypt,
  decrypt,
  encryptField,
};
