import server from "./server";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Converter({ address, setAddress, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    privateKey = evt.target.value;
    setPrivateKey(privateKey);

    let publicKey = secp256k1.getPublicKey(privateKey);
    console.log(toHex(publicKey));
    address = toHex(publicKey).slice(-20);
    setAddress(address.toString());
  }

  return (
    <div className="container converter">
      <h1>Converter</h1>

      <label>
        Private Key
        <input
          placeholder="Input private key..."
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="address">Address: {address.toString()}</div>
    </div>
  );
}

export default Converter;
