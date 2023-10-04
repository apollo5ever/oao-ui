import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { LoginContext } from "../LoginContext";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";

export function useRPCWallet() {
  const [state, setState] = useContext(LoginContext);
  const [walletInfo, setWalletInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const deroBridgeApiRef = useRef();

  const fetchWalletInfo = async () => {
    console.log("FETCH WALLET INFO");
    deroBridgeApiRef.current = new DeroBridgeApi();
    const deroBridgeApi = deroBridgeApiRef.current;

    const [err] = await to(deroBridgeApi.init());
    if (err) {
      setError(err);
      console.log("ERR", err);
    } else {
      setState((state) => ({ ...state, deroBridgeApiRef: deroBridgeApiRef }));
      console.log("STATE", state);
      getRandom();
      getAddress();
      //getSCID()
    }
  };

  const getRandom = useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current;

    const [err0, res0] = await to(
      deroBridgeApi.daemon("get-random-address", {})
    );

    console.log("get-random-address-error", err0);
    console.log(res0);
    if (err0 == null) {
      setState((state) => ({
        ...state,
        randomAddress: res0.data.result.address[0],
      }));
    }
  });

  const getAddress = useCallback(async (d) => {
    const deroBridgeApi = d.current;

    const [err0, res0] = await to(deroBridgeApi.wallet("get-address", {}));

    console.log("get-address-error", err0);
    console.log(res0);
    if (err0 == null) {
      let newWalletList = state.walletList;
      newWalletList[0].address = res0.data.result.address;
      setState((state) => ({
        ...state,
        walletList: newWalletList,
      }));
    } else {
      let newWalletList = state.walletList;
      newWalletList[0].address = null;
    }
  });

  useEffect(() => {
    fetchWalletInfo(); //i feel like this shouldn't be here
  }, []);

  return [walletInfo, isLoading, error, fetchWalletInfo, getAddress];
}
