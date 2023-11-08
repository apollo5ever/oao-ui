import React from "react";
import hex2a from "../hex2a";
import { useSendTransaction } from "../hooks/useSendTransaction";
import Treasury from "./treasury";

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
      <div className="oaoInfo">
        <Treasury OAO={OAO} />
      </div>
      {seat.id >= 0 ? (
        <>
          <p>You control seat: {seat.id}</p>
          {seat.owner ? (
            <button onClick={claimSeat}>Claim Your Seat</button>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
      {ceo ? <>You are the CEO.</> : ""}
      <h3>Board</h3>
      <p>
        {OAO.quorum}/{OAO.board.length}
      </p>
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
            <input placeholder="key" id="k" />
            <input placeholder="value" id="v" />
            <label>
              <input type="radio" id="t" name="datatype" value="1" />
              Integer
            </label>
            <label>
              <input type="radio" id="t" name="datatype" value="0" />
              String
            </label>
            <button type="submit">Propose</button>
          </form>
        </>
      )}
    </>
  );
}
