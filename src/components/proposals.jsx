import React, { useState } from "react";
import { Container, Button, Tab, Tabs } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { SHA256 } from "crypto-js";
import { usePropose } from "../hooks/usePropose";
import { useSendTransaction } from "../hooks/useSendTransaction";
import hex2a from "../hex2a";
import HashChecker from "./hashChecker";
import CodeProposal from "./codePropose";
import Update from "./update";
import Approve from "./approve";

export default function Proposals({ OAO, role }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [hash, setHash] = useState("");
  const [checkHash, setCheckHash] = useState(false);
  const [datatype, setDatatype] = useState("0");
  const [propose] = usePropose();
  const [sendTransaction] = useSendTransaction();

  const store = () => {
    sendTransaction({
      scid: OAO.scid,
      sc_rpc: [
        {
          name: "entrypoint",
          value: "Store",
          datatype: "S",
        },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    propose(
      OAO.scid,
      hash,
      key,
      value,
      datatype,
      role.tokenName,
      role.index,
      OAO.proposeFunction,
      OAO.version
    );
  };

  return (
    <Container>
      <h3>Proposals</h3>
      {OAO.proposal.type && OAO.proposal.hash != SHA256(OAO.code).toString() ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Active Proposal</h4>
          {OAO.proposal.key ? (
            <p>
              Proposal to STORE("{OAO.proposal.key}",
              {OAO.proposal.datatype == "S" ? <>"</> : ""}
              {OAO.proposal.value}
              {OAO.proposal.datatype == "S" ? <>"</> : ""})
            </p>
          ) : (
            <>
              <p>Proposal to Update Contract. Hash: {OAO.proposal.hash}</p>

              <button onClick={() => setCheckHash(!checkHash)}>
                {checkHash ? "x" : "Open Hash Checker"}
              </button>
              {checkHash ? (
                <HashChecker OAO={OAO} proposedHash={OAO.proposal.hash} />
              ) : (
                ""
              )}
            </>
          )}
          <p>
            Votes: {OAO.proposal.approval}/{OAO.proposal.quorum}
          </p>
          {OAO.proposal.type == "Store" &&
          OAO.proposal.approval >= OAO.proposal.quorum ? (
            <button onClick={store}>Store Value</button>
          ) : OAO.proposal.hash &&
            OAO.proposal.approval >= OAO.proposal.quorum &&
            OAO.ceo ? (
            <Update OAO={OAO} role={role} proposedHash={OAO.proposal.hash} />
          ) : (
            ""
          )}
          {role && role.index >= 0 ? (
            <Approve
              index={role.index}
              voteFunction={OAO.voteFunction}
              asset={role.tokenName}
              scid={OAO.scid}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ marginBottom: "10px" }}>Make New Proposal</h4>

        <Tabs defaultActiveKey="var" id="proposal-tabs">
          <Tab eventKey="var" title="Var">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Key</Form.Label>
                <Form.Control
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Datatype</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="String"
                    name="datatype"
                    value="0"
                    checked={datatype === "0"}
                    onChange={() => setDatatype("0")}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Integer"
                    name="datatype"
                    value="1"
                    checked={datatype === "1"}
                    onChange={() => setDatatype("1")}
                  />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="code" title="Code">
            <CodeProposal OAO={OAO} role={role} />
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}
