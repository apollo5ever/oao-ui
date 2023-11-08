import React, { useState, useContext, useCallback } from "react";
import { LoginContext } from "../LoginContext";
import to from "await-to-js";
import WebSocketService from "../webSocketService";

export function useGetBalance() {
  const [state, setState] = useContext(LoginContext);

  const getBalanceRPC = useCallback(async (scid) => {
    const deroBridgeApi = state.deroBridgeApiRef.current;
    const [err, res] = await to(
      deroBridgeApi.wallet("get-balance", {
        scid: scid,
      })
    );
    console.log("rpc balance check", scid, res);
    return res.data.result.balance;
  });

  const getBalanceXSWD = async (scid) => {
    return new Promise((resolve, reject) => {
      const payload = {
        jsonrpc: "2.0",
        method: "GetBalance",
        id: `balance${scid}`,
        params: { scid: scid },
      };

      const handleResponse = (response) => {
        if (response.id === `"balance${scid}"`) {
          resolve(response.result.balance);
        }
      };

      // Subscribe to WebSocket messages
      state.ws.socket.addEventListener("message", (event) => {
        const response = JSON.parse(event.data);
        handleResponse(response);
      });

      // Send the payload
      state.ws.sendPayload(payload);
    });
  };

  async function getBalance(scid) {
    if (state.walletMode == "xswd") {
      return await getBalanceXSWD(scid);
    } else if (state.walletMode == "rpc") {
      console.log("getBalanceRPC", scid);
      return await getBalanceRPC(scid);
    }

    /*  if (state.activeWallet === 0) {
      let balance = await getBalanceRPC(scid);
      return balance;
    } else {
      let balance = await getBalanceWasm(scid);
      return balance;
    } */
    /*  if (!state.walletList[state.activeWallet].open) return

      const tx = await new Promise((resolve) => {
        state.worker.onmessage = (event) => {
          resolve(event.data);
        };

        state.worker.postMessage({
          functionName: "WalletGetBalance",
          args: ["key", state.walletList[state.activeWallet].name, scid]
        });
      });

     // console.log(scid,'balance',tx.key.matureBalance)
     // return (tx.key.matureBalance)
     //return(69)


      const interval = setInterval(async () => {
        if (tx) {
          clearInterval(interval);
          console.log(tx)

          let asyncKey2 = "sent";

          const send = await new Promise((resolve) => {
            state.worker.onmessage = (event) => {
              resolve(event.data);
            };


          });
          console.log("send", send)
          return send.key.matureBalance

        }
      }, 100); // check every 100ms
    } */
  }

  return [getBalance];
}
