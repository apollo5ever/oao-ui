import React from "react";
import hex2a from "../hex2a";
import { useSendTransaction } from "../useSendTransaction";

export default function OAO({ OAO, ceo, seat }) {
  const [sendTransaction] = useSendTransaction();

  const handleSubmit = () => {
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
          {seat.id >= 0 ? <button onClick={handleSubmit}>Vote</button> : ""}
        </>
      ) : (
        ""
      )}
    </>
  );
}
