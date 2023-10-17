import to from "await-to-js";
import { useContext } from "react";
import { LoginContext } from "../LoginContext";

export function useGetGasEstimate() {
  const [state, setState] = useContext(LoginContext);

  async function getGasEstimate(data) {
    if (state.daemonMode == "pools") {
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
          signer: data.signer,
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
    } else if (state.walletMode == "rpc") {
      const deroBridgeApi = state.deroBridgeApiRef.current;

      const [err, res] = await to(
        deroBridgeApi.daemon("get-gas-estimate", {
          scid: data.scid,
          ringsize: data.ringsize,
          transfers: data.transfers,
          sc_rpc: data.gas_rpc,
          sc: data.sc,
          signer: data.signer,
        })
      );
      console.log("rpc gas", res);
      return res.data.result.gasstorage;
    } else if (state.walletMode == "xswd") {
      return new Promise((resolve, reject) => {
        const payload = {
          jsonrpc: "2.0",
          id: `getGasEstimate${data?.gas_rpc[0]?.value}`,
          method: "DERO.GetGasEstimate",
          params: {
            scid: data.scid,
            ringsize: data.ringsize,
            transfers: data.transfers,
            sc_rpc: data.gas_rpc,
            sc: data.sc,
            signer: data.signer,
          },
        };

        const handleResponse = (response) => {
          console.log("handling it", response);
          if (response.id === payload.id) {
            console.log("yep!", response);
            resolve(response.result.gasstorage);
          }
        };
        state.ws.socket.addEventListener("message", (event) => {
          const response = JSON.parse(event.data);
          handleResponse(response);
        });

        // Send the payload
        state.ws.sendPayload(payload);
      });
    }
  }

  return [getGasEstimate];
}
