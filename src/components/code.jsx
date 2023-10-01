import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { SHA256 } from "crypto-js";

export default function Code({ OAO }) {
  return (
    <Container>
      <pre className="pre-scrollable">{OAO.code}</pre>
    </Container>
  );
}
