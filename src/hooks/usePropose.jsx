import { useSendTransaction } from "./useSendTransaction.jsx";

export function usePropose() {
  const [sendTransaction] = useSendTransaction();

  const propose = (scid, hash, k, v, t, asset, id) => {
    sendTransaction({
      scid: scid,
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
          name: "hash",
          value: hash,
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
          value: parseInt(t),
          datatype: "U",
        },
        {
          name: "seat",
          value: parseInt(id),
          datatype: "U",
        },
      ],
    });
  };
  return [propose];
}
