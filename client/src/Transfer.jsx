import { useState } from "react";
import server from "./server";

import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function signTransaction(privateKey, messageHash) {
    return secp256k1.sign(privateKey, messageHash);
  }

  async function transfer(evt) {
    evt.preventDefault();

    const message = JSON.stringify({
      sender: address,
      senderPublicKey: toHex(secp256k1.getPublicKey(privateKey)),
      recipient: recipient,
      amount: parseInt(sendAmount),
    });
    const messageHash = sha256(utf8ToBytes(message));
    const signature = signTransaction(privateKey, messageHash);

    console.log(message, messageHash, signature);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        message: message,
        messageHash: messageHash,
        signature: signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
