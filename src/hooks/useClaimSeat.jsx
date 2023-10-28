import { useSendTransaction } from "./useSendTransaction.jsx";
import { useGetGasEstimate } from "./useGetGasEstimate.jsx";
import { useGetAddress } from "./useGetAddress.jsx";

export function useClaimSeat() {
  const [sendTransaction] = useSendTransaction();
  const [getGasEstimate] = useGetGasEstimate();
  const [getAddress] = useGetAddress();

  const claimSeat = async (scid, id) => {
    let address = await getAddress();

    let sc_rpc = [
      {
        name: "entrypoint",
        value: "ClaimSeat",
        datatype: "S",
      },
      {
        name: "seat",
        datatype: "U",
        value: id,
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
      gas_rpc: gas_rpc,
    });
    sendTransaction({
      scid: scid,
      ringsize: 2,
      fees: fees,
      sc_rpc: sc_rpc,
    });
  };
  return [claimSeat];
}
