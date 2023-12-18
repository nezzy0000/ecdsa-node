const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { sha256 } = require("ethereum-cryptography/sha256");

const privateKey = secp.secp256k1.utils.randomPrivateKey();
console.log("Private Key:", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("Public Key:", toHex(publicKey));

const address = toHex(publicKey).slice(-20);
console.log("Address:", address);

const messageHash = sha256(utf8ToBytes("message"));
const signature = secp.secp256k1.sign(messageHash, privateKey);
console.log("Signature:", signature);

const isSigned = secp.secp256k1.verify(signature, messageHash, publicKey);
console.log("Verified:", isSigned);

console.log(
  "Recovered Public Key:",
  signature.recoverPublicKey(toHex(messageHash)).toHex()
);
