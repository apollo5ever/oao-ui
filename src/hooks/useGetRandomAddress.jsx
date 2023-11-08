import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { LoginContext } from "../LoginContext";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";

export function useGetRandomAddress() {
  const [state, setState] = useContext(LoginContext);
  const [walletInfo, setWalletInfo] = useState(null);

  const getRandomRPC = useCallback(async () => {
    const deroBridgeApi = state.deroBridgeApiRef.current;

    const [err0, res0] = await to(
      deroBridgeApi.daemon("get-random-address", {})
    );

    return res0.data.result.address[0];
  });

  const getRandomAddress = async () => {
    if (state.daemonMode == "pools") {
      return;
    } else if (state.walletMode == "rpc") {
      return await getRandomRPC();
    } else if (state.walletMode == "xswd") {
      return;
    }
  };

  return [getRandomAddress];
}
