import { useSendTransaction } from "./useSendTransaction.jsx";
import { useGetGasEstimate } from "./useGetGasEstimate.jsx";
import { useGetAddress } from "./useGetAddress.jsx";

export function useApprove() {
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();

  const approve = async ({ scid, asset, name, index }) => {
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
          value: name,
          datatype: "S",
        },
        {
          name: "seat",
          value: parseInt(index),
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
          value: name,
          datatype: "S",
        },
        {
          name: "seat",
          value: parseInt(index),
          datatype: "U",
        },
      ],
    });
  };
  return [approve];
}
