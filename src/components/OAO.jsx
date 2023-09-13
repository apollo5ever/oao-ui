import React from "react";
import hex2a from "../hex2a";
import { useSendTransaction } from "../useSendTransaction";

export default function OAO({ OAO, ceo, seat }) {
  const [sendTransaction] = useSendTransaction();

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

  const propose = (e) => {
    e.preventDefault();
    let k = e.target.k.value;
    let v = e.target.v.value;
    let t = parseInt(e.target.t.value);

    let asset = "";
    if (ceo) {
      asset = OAO.ceo;
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
      {seat.id >= 0 ? <>You control seat: {seat.id}</> : ""}
      {ceo ? <>You are the CEO.</> : ""}
      {OAO.k ? (
        <>
          <h3>Proposal</h3>
          {OAO.t == 0 ? (
            <p>
              Proposal to STORE("{hex2a(OAO.k)}","{hex2a(OAO.s)}")
            </p>
          ) : OAO.t == 1 ? (
            <p>
              Proposal to STORE("{hex2a(OAO.k)}",{OAO.u})
            </p>
          ) : (
            ""
          )}
          <p>
            Votes: {OAO.approve}/{OAO.quorum}
          </p>
          {OAO.approve >= OAO.quorum ? (
            <button onClick={store}>Store Value</button>
          ) : (
            ""
          )}
          {seat.id >= 0 ? <button onClick={vote}>Vote</button> : ""}
        </>
      ) : (
        <>
          <form onSubmit={propose}>
            <input id="k" />
            <input id="v" />
            <input id="t" />
            <button type="submit">Propose</button>
          </form>
        </>
      )}
    </>
  );
}
