const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { sha256 } = require("ethereum-cryptography/sha256");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "38199d4693f584655b5a": 100,
  "b8d46d2f033c44c2778c": 50,
  "65a075cbe22c17f8f609": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

function verifyMessage(message, messageHash) {
  if (sha256(utf8ToBytes(message)) == messageHash) {
    return true;
  }
  return false;
}

function verifySigner(signature, messageHash, publicKey) {
  const isSigned = secp.secp256k1.verify(signature, messageHash, publicKey);
  if (
    isSigned &&
    publicKey == signature.recoverPublicKey(toHex(messageHash)).toHex()
  ) {
    return true;
  }
  return false;
}

app.post("/send", (req, res) => {
  const { message, messageHash, signature } = req.body;
  console.log("message: " + message + "\nmessageHash: " + messageHash + "\nsignature: " + signature);

  //if (verifyMessage(messsage, messageHash)) {
    const { sender, senderPublicKey, recipient, amount } = JSON.parse(message);
    // if (verifySigner(signature, messageHash, senderPublicKey)) {
      setInitialBalance(sender);
      setInitialBalance(recipient);

      console.log("Sending...");
      console.log("Sender: " + sender);
      console.log("Recipient: " + recipient);

      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    // } else {
    //   res.status(400).send({ message: "Sender Verification failed!" });
    // }
  //} else {
  //   res.status(400).send({ message: "Message Verification failed!" });
  // }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
