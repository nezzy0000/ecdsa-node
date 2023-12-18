import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Converter from "./Converter";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <div className="app">
      <Converter
        setAddress={setWalletAddress}
        address={walletAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;
