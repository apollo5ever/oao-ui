import React, { useState, useContext } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { LoginContext } from "../LoginContext";
import { useRPCWallet } from "../hooks/useRPCWallet";

const WalletToggle = () => {
  const [checked, setChecked] = useState(false);
  const [state, setState] = useContext(LoginContext);
  const [walletMode, setWalletMode] = useState("rpc");
  const [daemonMode, setDaemonMode] = useState("pools");
  const [fetchWalletInfo] = useRPCWallet();

  const walletModes = [
    { name: "RPC", value: "rpc" },
    { name: "XSWD", value: "xswd" },
  ];
  const daemonModes = [
    { name: "User", value: "user" },
    { name: "Pools", value: "pools" },
  ];

  const handleWalletToggle = (value) => {
    setWalletMode(value);
    console.log("wallet", value);
    setState((state) => ({ ...state, walletMode: value }));
    /*   if (value == "rpc") {
      fetchWalletInfo();
    } */
  };
  const handleDaemonToggle = (value) => {
    console.log("daemon", value);
    setDaemonMode(value);
    setState((state) => ({ ...state, daemonMode: value }));
  };

  return (
    <div className="rpc-toggle">
      <ButtonGroup>
        {walletModes.map((radio, idx) => (
          <ToggleButton
            key={idx + 2}
            id={`wallet-${idx}`}
            type="radio"
            variant={idx % 2 ? "outline-success" : "outline-danger"}
            name="walletToggle"
            value={radio.value}
            checked={walletMode === radio.value}
            onChange={(e) => handleWalletToggle(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default WalletToggle;
