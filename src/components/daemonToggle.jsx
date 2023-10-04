import React, { useState, useContext } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { LoginContext } from "../LoginContext";

const DaemonToggle = () => {
  const [checked, setChecked] = useState(false);
  const [state, setState] = useContext(LoginContext);
  const [daemonMode, setDaemonMode] = useState("pools");

  const daemonModes = [
    { name: "Pools", value: "pools" },
    { name: "User", value: "user" },
  ];

  const handleDaemonToggle = (value) => {
    setDaemonMode(value);
    setState((state) => ({ ...state, daemonMode: value }));
  };

  return (
    <div className="daemon-toggle">
      <ButtonGroup>
        {daemonModes.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`daemon-${idx}`}
            type="radio"
            variant={idx % 2 ? "outline-success" : "outline-danger"}
            name="daemonToggle"
            value={radio.value}
            checked={daemonMode === radio.value}
            onChange={(e) => handleDaemonToggle(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default DaemonToggle;
