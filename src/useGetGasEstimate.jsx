import to from "await-to-js";
import { useContext } from "react";
import { LoginContext } from "./LoginContext";

export function useGetGasEstimate() {
  const [state, setState] = useContext(LoginContext);

  async function getGasEstimate(data) {
    if (state.daemon == "rpc") {
      const deroBridgeApi = state.deroBridgeApiRef.current;

      const [err, res] = await to(
        deroBridgeApi.daemon("get-gas-estimate", {
          scid: data.scid,
          ringsize: data.ringsize,
          transfers: data.transfers,
          sc_rpc: data.gas_rpc,
          sc: data.sc,
          signer: state.walletList[state.activeWallet].address,
        })
      );
      console.log(res);
      return res.data.result.gasstorage;

      return await rpcSend(rpcData);
    } else if (state.daemon == "pools") {
      let poolData = JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "DERO.GetGasEstimate",
        params: {
          scid: data.scid,
          ringsize: data.ringsize,
          transfers: data.transfers,
          sc_rpc: data.gas_rpc,
          sc: data.sc,
          signer: state.walletList[state.activeWallet].address,
        },
      });

      let res = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: "POST",

        body: poolData,
        headers: { "Content-Type": "application/json" },
      });
      let body = await res.json();
      let gasData = body.result;

      console.log("gasData", gasData);

      return gasData.gasstorage;
    }
  }

  return [getGasEstimate];
}
