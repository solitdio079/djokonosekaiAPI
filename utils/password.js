import {promisify} from "node:util"
const { randomBytes, scrypt,timingSafeEqual } = await import("node:crypto");

const promisedRandomBytes = promisify(randomBytes)
const promisedScrypt = promisify(scrypt)
const promisedTimingSafeEqual = promisify(timingSafeEqual)

async function hashPassword(password) {
 
  // create a salt for each password
  const salt = await promisedRandomBytes(32);

  const hash = await promisedScrypt(password, salt.toString("hex"), 32);

  return [hash.toString("hex"), salt.toString("hex")].join(" ");
}

async function verifyPassword(password, hashedPassword) {
  const [hash, salt] = hashedPassword.split(" ");
  const hashBuff = Buffer.from(hash, "hex");

  const verifyBuff = await promisedScrypt(password, salt, 32)

  if(verifyBuff.length !== hashBuff.length) return false

  return timingSafeEqual(verifyBuff,hashBuff)
}


export {verifyPassword,hashPassword}