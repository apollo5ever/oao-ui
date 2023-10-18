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

export default function MOAO({ OAO, ceo, seat }) {
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
          scid: seat.scid,
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
          value: seat.id,
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
          value: seat.id,
        },
      ],
    });
  };

  const propose = (e) => {
    e.preventDefault();
    let k = e.target.k.value;
    let v = e.target.v.value;
    let t = parseInt(e.target.t.value);

    let asset = "";
    if (ceo) {
      asset = OAO.users.filter((x) => x.type == "CEO")[0].tokenName;
    } else {
      asset = seat.scid;
    }
    sendTransaction({
      scid: OAO.scid,
      ringsize: 2,
      transfers: [
        {
          scid: asset,
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
          value: parseInt(seat.id),
          datatype: "U",
        },
      ],
    });
  };

  return (
    <>
      <h1>{OAO.name}</h1>
      {ceo ? <>Welcome Mr. CEO</> : ""}
      {seat.id ? <>Hello Board Member {seat.id}</> : ""}
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
            <Proposals OAO={OAO} ceo={ceo} seat={seat} />
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
