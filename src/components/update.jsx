import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { SHA256 } from "crypto-js";
import { usePropose } from "../hooks/usePropose";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetGasEstimate } from "../hooks/useGetGasEstimate";

export default function Update({ OAO, proposedHash }) {
  const [textareaValue, setTextareaValue] = useState("");
  const textareaRef = useRef(null);
  const [myHash, setMyHash] = useState("");
  const [propose] = usePropose();
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [error, setError] = useState("");

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [textareaValue]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      console.log("text ref not null", textareaRef.current.scrollHeight);
      // Calculate the height based on the number of lines in textareaValue
      const lineHeight = 20; // Adjust this value based on your textarea's line height
      const numberOfLines = textareaValue.split("\n").length;
      const calculatedHeight = numberOfLines * lineHeight;
      console.log("number of lines", numberOfLines);
      // Set the calculated height as the style
      textareaRef.current.style.height = `${calculatedHeight}px`;
      // textareaRef.current.style.height = "auto";
      // textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    } else {
      // Calculate the height based on the number of lines in textareaValue
      const lineHeight = 20; // Adjust this value based on your textarea's line height
      const numberOfLines = textareaValue.split("\n").length;
      const calculatedHeight = numberOfLines * lineHeight;
      console.log("number of lines", numberOfLines);
      // Set the calculated height as the style
      textareaRef.current.style.height = `${calculatedHeight}px`;
    }
  };

  const handleSubmit = async () => {
    const data = {
      scid: OAO.scid,
      ringsize: 2,
      transfers: [
        {
          scid: OAO.ceo,
          burn: 1,
        },
      ],
      gas_rpc: [
        {
          name: "SC_ACTION",
          datatype: "U",
          value: 0,
        },
        {
          name: "SC_ID",
          datatype: "H",
          value: OAO.scid,
        },
        {
          name: "entrypoint",
          datatype: "S",
          value: "Update",
        },
        {
          name: "code",
          datatype: "S",
          value: textareaValue,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "Update",
        },
        {
          name: "code",
          datatype: "S",
          value: textareaValue,
        },
      ],
      sc: "",
    };

    let fee = await getGasEstimate(data);
    if (fee > 0) {
      data.fees = fee;
      sendTransaction(data);
    } else {
      console.log(fee);
    }

    //setActiveTab("proposals");
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
    const hash = SHA256(event.target.value).toString();
    console.log("Textarea hash:", hash);
    setMyHash(hash);
  };

  return (
    <Container>
      <h4>Enter Code Here to Update Contract</h4>
      <p>Hash of code entered below: {myHash}</p>
      {error}
      {proposedHash == myHash ? (
        <>
          <p>This code matches with the proposal.</p>
          <button onClick={handleSubmit}>Update</button>
        </>
      ) : (
        <p>This code does not match with the proposal.</p>
      )}
      <Form.Control
        as="textarea"
        ref={textareaRef}
        style={{
          height: "auto",
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        value={textareaValue}
        onChange={handleTextareaChange}
      />

      <p>Hash of code entered above: {myHash}</p>
      {proposedHash == myHash ? (
        <p>This code matches with the proposal.</p>
      ) : (
        <p>This code does not match with the proposal.</p>
      )}
    </Container>
  );
}
