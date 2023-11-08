import React, { useState, useContext } from "react";
import { LoginContext } from "../LoginContext";
import to from "await-to-js";

export function useGetAddress() {
  const [state, setState] = useContext(LoginContext);

  const rpcGetAddress = React.useCallback(async (deroBridgeApiRef) => {
    const deroBridgeApi = deroBridgeApiRef.current;

    const [err, res] = await to(deroBridgeApi.wallet("get-address", {}));
    console.log("rpc get address", res.data.result.address);
    return res.data.result.address;
  });

  async function getAddress(deroBridgeApiRef) {
    if (state.walletMode == "rpc") {
      if (!deroBridgeApiRef) {
        deroBridgeApiRef = state.deroBridgeApiRef;
      }
      return await rpcGetAddress(deroBridgeApiRef);
    } else if (state.walletMode == "xswd") {
      return new Promise((resolve, reject) => {
        const payload = {
          jsonrpc: "2.0",
          id: `1`,
          method: "GetAddress",
        };

        const handleResponse = (data) => {
          console.log("handling it", data.id);
          if (data.id == `"${payload.id}"`) {
            resolve(data.result.address);
          }
        };
        state.ws.socket.addEventListener("message", (event) => {
          console.log(event);
          const data = JSON.parse(event.data);
          console.log(data);
          handleResponse(data);
        });

        // Send the payload
        state.ws.sendPayload(payload);
      });
    }
  }

  return [getAddress];
}
