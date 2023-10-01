import React, { useState } from "react";
import { Container, Button, Tab, Tabs } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { SHA256 } from "crypto-js";
import { usePropose } from "./usePropose";
import { useSendTransaction } from "../useSendTransaction";
import hex2a from "../hex2a";
import HashChecker from "./hashChecker";
import CodeProposal from "./codePropose";
import Update from "./update";

export default function Proposals({ OAO, ceo, seat }) {
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
    console.log("CEO", ceo);
    let asset;
    if (ceo) {
      asset = OAO.ceo;
    } else {
      asset = seat.scid;
    }
    let id = seat.id;

    propose(OAO.scid, hash, key, value, datatype, asset, id);
  };

  return (
    <Container>
      <h3>Proposals</h3>
      {OAO.k || (OAO.hash && hex2a(OAO.hash) != SHA256(OAO.code).toString()) ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Active Proposal</h4>
          {OAO.k && OAO.t == 0 ? (
            <p>
              Proposal to STORE("{hex2a(OAO.k)}","{hex2a(OAO.s)}")
            </p>
          ) : OAO.k && OAO.t == 1 ? (
            <p>
              Proposal to STORE("{hex2a(OAO.k)}",{OAO.u})
            </p>
          ) : (
            <>
              <p>Proposal to Update Contract. Hash: {hex2a(OAO.hash)}</p>

              <button onClick={() => setCheckHash(!checkHash)}>
                {checkHash ? "x" : "Check hash"}
              </button>
              {checkHash ? (
                <HashChecker OAO={OAO} proposedHash={hex2a(OAO.hash)} />
              ) : (
                ""
              )}
            </>
          )}
          <p>
            Votes: {OAO.approve}/{OAO.quorum}
          </p>
          {OAO.k && OAO.approve >= OAO.quorum ? (
            <button onClick={store}>Store Value</button>
          ) : OAO.hash && OAO.approve >= OAO.quorum && OAO.ceo ? (
            <Update
              OAO={OAO}
              ceo={ceo}
              seat={seat}
              proposedHash={hex2a(OAO.hash)}
            />
          ) : (
            ""
          )}
          {seat.id >= 0 ? <button onClick={vote}>Vote</button> : ""}
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
            <CodeProposal OAO={OAO} ceo={ceo} seat={seat} />
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}
