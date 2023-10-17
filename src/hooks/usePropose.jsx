import { useSendTransaction } from "./useSendTransaction.jsx";
import { useGetGasEstimate } from "./useGetGasEstimate.jsx";
import { useGetAddress } from "./useGetAddress.jsx";

export function usePropose() {
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();

  const propose = async (scid, hash, k, v, t, asset, id, signer) => {
    let address = await getAddress();
    let fees = await getGasEstimate({
      scid: scid,
      ringsize: 2,
      signer: address,
      transfers: [
        {
          scid: asset,
          burn: 1,
        },
      ],
      gas_rpc: [
        {
          name: "SC_ACTION",
          datatype: "U",
          value: 0,
        },
        {
          name: "SC_ID",
          datatype: "H",
          value: scid,
        },
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
    sendTransaction({
      scid: scid,
      ringsize: 2,
      fees: fees,
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
