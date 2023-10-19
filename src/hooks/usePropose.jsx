import { useSendTransaction } from "./useSendTransaction.jsx";
import { useGetGasEstimate } from "./useGetGasEstimate.jsx";
import { useGetAddress } from "./useGetAddress.jsx";

export function usePropose() {
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();

  const propose = async (
    scid,
    hash,
    k,
    v,
    t,
    asset,
    id,
    proposeFunction,
    version
  ) => {
    let address = await getAddress();
    console.log("hash,k,v,t,id", hash, k, v, t, parseInt(id));
    let datatype = "S";
    if (t == 1) {
      datatype = "U";
    }

    if (version == "PI") {
      console.log("propose version PI");
      let sc_rpc = [
        {
          name: "entrypoint",
          value: proposeFunction.name,
          datatype: "S",
        },
        {
          name: "hash",
          datatype: "S",
          value: hash,
        },
        {
          name: "k",
          datatype: "S",
          value: k,
        },
        {
          name: "v",
          datatype: "S",
          value: v,
        },
        {
          name: "t",
          datatype: "S",
          value: datatype,
        },
        {
          name: "seat",
          datatype: "U",
          value: parseInt(id),
        },
      ];
      let gas_rpc = [
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
      ].concat(sc_rpc);

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
        gas_rpc: gas_rpc,
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
        sc_rpc: sc_rpc,
      });
    } else {
      /*   */
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
    }
  };
  return [propose];
}
