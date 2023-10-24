import React, { useState } from "react";
import { Container, Nav, Tab, Tabs } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Treasury from "./treasury";
import Update from "./codePropose";
import { useSendTransaction } from "../hooks/useSendTransaction";
import "../App.css";
import Proposals from "./proposals";
import Code from "./code";

export default function MOAO({ OAO, role }) {
  const [activeTab, setActiveTab] = useState("treasury");
  const [sendTransaction] = useSendTransaction();

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const vote = () => {
    sendTransaction({
      scid: OAO.scid,
      ringsize: 2,
      transfers: [
        {
          scid: role.tokenName,
          burn: 1,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          value: "Approve",
          datatype: "S",
        },
        {
          name: "seat",
          datatype: "U",
          value: role.index,
        },
      ],
    });
  };

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

  const claimSeat = () => {
    sendTransaction({
      scid: OAO.scid,
      ringsize: 2,
      sc_rpc: [
        {
          name: "entrypoint",
          value: "ClaimSeat",
          datatype: "S",
        },
        {
          name: "seat",
          datatype: "U",
          value: role.index,
        },
      ],
    });
  };

  const propose = (e) => {
    e.preventDefault();
    let k = e.target.k.value;
    let v = e.target.v.value;
    let t = parseInt(e.target.t.value);

    sendTransaction({
      scid: OAO.scid,
      ringsize: 2,
      transfers: [
        {
          scid: role.tokenName,
          burn: 1,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          value: "Propose",
          datatype: "S",
        },
        {
          name: "k",
          value: k,
          datatype: "S",
        },
        {
          name: "u",
          value: parseInt(v),
          datatype: "U",
        },
        {
          name: "s",
          value: v,
          datatype: "S",
        },
        {
          name: "t",
          value: t,
          datatype: "U",
        },
        {
          name: "seat",
          value: parseInt(role.index),
          datatype: "U",
        },
      ],
    });
  };

  return (
    <>
      <h1>{OAO.name}</h1>
      {role && role.type == "CEO" ? (
        <>Welcome Mr. CEO</>
      ) : role ? (
        <>Welcome Trustee #{role.index}</>
      ) : (
        ""
      )}

      <Tabs
        id="controlled-tab-example"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Tab eventKey="code" title="Code">
          <div style={{ marginTop: "20px" }}>
            <Code OAO={OAO} />
          </div>
        </Tab>
        <Tab eventKey="treasury" title="Treasury">
          <div style={{ marginTop: "20px" }}>
            <Treasury OAO={OAO} />
          </div>
        </Tab>
        <Tab eventKey="proposals" title="Proposals">
          <div style={{ marginTop: "20px" }}>
            <Proposals OAO={OAO} role={role} />
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
