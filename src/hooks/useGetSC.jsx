import { useContext } from "react";
import { LoginContext } from "../LoginContext";
import to from "await-to-js";
//import LoggerContext, { LOG } from "@/components/providers/LoggerContext.jsx";

export function useGetSC() {
  const [state, setState] = useContext(LoginContext);
  // const logger = useContext(LoggerContext);

  async function getSC(
    scid,
    code,
    variables,
    topoheight,
    keysuint64,
    keysstring,
    keysbytes
  ) {
    if (state.daemonMode == "pools") {
      let data = JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "DERO.GetSC",
        params: {
          scid: scid,
          code: code,
          variables: variables,
          topoheight: topoheight,
          keysuint64: keysuint64,
          keysstring: keysstring,
          keysbytes: keysbytes,
        },
      });

      let res = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: "POST",

        body: data,
        headers: { "Content-Type": "application/json" },
      });
      let body = await res.json();
      let scData = body.result;
      console.log(`scData ${scid}`, scData);

      return scData;
    } else if (state.walletMode == "rpc") {
      console.log("rpc get sc");
      const deroBridgeApi = state.deroBridgeApiRef.current;

      const [err, res] = await to(
        deroBridgeApi.daemon("get-sc", {
          scid: scid,
          code: code,
          variables: variables,
          topoheight: topoheight,
          keysuint64: keysuint64,
          keysstring: keysstring,
          keysbytes: keysbytes,
        })
      );
      console.log(res.data.result);
      return res.data.result;
    } else if (state.walletMode == "xswd") {
      return new Promise((resolve, reject) => {
        const payload = {
          jsonrpc: "2.0",
          id: `getSC${scid}`,
          method: "DERO.GetSC",
          params: {
            scid: scid,
            code: code,
            variables: variables,
            topoheight: topoheight,
            keysuint64: keysuint64,
            keysstring: keysstring,
            keysbytes: keysbytes,
          },
        };

        const handleResponse = (response) => {
          console.log("handling it", response.id);
          if (response.id === `getSC${scid}`) {
            console.log("yep!", response);
            resolve(response.result);
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

  return [getSC];
}
