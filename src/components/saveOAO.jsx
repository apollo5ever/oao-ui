import React, { useState, useContext } from "react";
import { useParseOAO } from "../hooks/useParseOAO";
import { LoginContext } from "../LoginContext";

const SaveOAO = () => {
  const [parseOAO] = useParseOAO();
  const [name, setName] = useState("");
  const [scid, setScid] = useState("");
  const [state, setState] = useContext(LoginContext);
  const [savedData, setSavedData] = useState(
    JSON.parse(localStorage.getItem("savedData")) || []
  );

  const handleSave = () => {
    const name = state.OAO.name;
    const scid = state.OAO.scid;
    const newData = { name, scid };
    const updatedData = [...savedData, newData];
    setSavedData(updatedData);
    localStorage.setItem("savedData", JSON.stringify(updatedData));
  };

  const handleLoad = async (selectedScid) => {
    console.log("parse oao ", selectedScid);
    let OAO = await parseOAO(selectedScid);
    setState((state) => ({ ...state, OAO: OAO }));
    console.log("oao save", OAO);
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>

      <br />
      <label>
        Load:
        <select onChange={(e) => handleLoad(e.target.value)}>
          <option value="">Select OAO</option>
          {savedData.map((data, index) => (
            <option key={index} value={data.scid}>
              {data.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SaveOAO;
