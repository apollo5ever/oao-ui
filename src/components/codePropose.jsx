import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { SHA256 } from "crypto-js";
import { usePropose } from "../hooks/usePropose";

export default function CodeProposal({ OAO, ceo, seat }) {
  const [textareaValue, setTextareaValue] = useState(OAO.code);
  const textareaRef = useRef(null);
  const [myHash, setMyHash] = useState("");
  const [propose] = usePropose();

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

  const handleSubmit = () => {
    console.log("Textarea hash:", myHash);
    let asset;
    if (ceo) {
      asset = OAO.ceo;
    } else {
      asset = seat.scid;
    }
    let id = seat.id;
    propose(OAO.scid, myHash, "", "", 0, asset, id);

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
      <button onClick={handleSubmit}>Make Update Proposal</button>
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
      <button onClick={handleSubmit}>Make Update Proposal</button>
    </Container>
  );
}
