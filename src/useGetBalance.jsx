import React, {useState, useContext, useCallback} from "react";
import {LoginContext} from "./LoginContext";
import to from "await-to-js";

export function useGetBalance() {
  const [state, setState] = useContext(LoginContext);

  const getBalanceRPC = useCallback(async (scid) => {
    if (state.activeWallet !== 0) return
    const deroBridgeApi = state.deroBridgeApiRef.current;
    const [err, res] = await to(
      deroBridgeApi.wallet("get-balance", {
        "scid": scid
      })
    );
      console.log("rpc balance check",scid,res)
    return res.data.result.balance
  });

  const getBalanceWasm = async (scid) => {
    if (!state.walletList[state.activeWallet].open) return;
  
    return new Promise((resolve, reject) => {
      state.worker.onmessage = (event) => {
        const tx = event.data;
        console.log("tx", tx);
        console.log("it's right here baby",scid,tx[`bal${scid+state.walletList[state.activeWallet].name}`].matureBalance)
        resolve(tx[`bal${scid+state.walletList[state.activeWallet].name}`].matureBalance);
      };
  
      state.worker.postMessage({
        functionName: "WalletGetBalance",
        args: ["bal"+scid+state.walletList[state.activeWallet].name, state.walletList[state.activeWallet].name, scid]
      });
    });
  };
  

  async function getBalance(scid) {
    if (state.activeWallet === 0) {
      let balance = await getBalanceRPC(scid)
      return balance
    } else {
      let balance = await getBalanceWasm(scid)
      return balance
    }
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


  return [getBalance]
}
