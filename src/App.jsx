import { useContext, useState, useRef, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CEO from "./components/ceo";
import Search from "./components/search";
import { useGetSC } from "./useGetSC";
import parseOAO from "./components/parseOAO";
import { useRPCWallet } from "./useRPCWallet";
import { LoginContext } from "./LoginContext";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";
import { useGetBalance } from "./useGetBalance";
import hex2a from "./hex2a";
import OAO from "./components/OAO";
import MOAO from "./components/mOAO";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [count, setCount] = useState(0);
  const [getSC] = useGetSC();
  const [getBalance] = useGetBalance();
  const [state, setState] = useContext(LoginContext);
  const deroBridgeApiRef = useRef();
  const [getAddress] = useRPCWallet();
  //const [walletInfo, isLoading, error, fetchWalletInfo] = useRPCWallet();

  //if user has loaded up contract using search component then state object will contain things like CEO, SEAT_1, QUORUM, APPROVAL
  //user's balance will be checked for CEO and Board tokens
  //if user has multiple roles, display role switcher to let user choose active role
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.scid.value);
    let sc = await getSC(e.target.scid.value);
    console.log(sc);
    let OAO = parseOAO(sc, e.target.scid.value);
    let ceo = await getBalance(OAO.ceo);
    let seat = -1;
    console.log(state);
    for (var i = 0; i < OAO.board.length; i++) {
      console.log("seat balance: ", OAO.board[i]);
      let bal = await getBalance(OAO.board[i].scid);
      if (bal) {
        console.log("balance for seat is ", bal);
        seat = OAO.board[i];
        break;
      }
      if (state.walletList[0].address === OAO.board[i].owner) {
        console.log("owner match!");
        seat = OAO.board[i];
        break;
      }
    }
    setState((state) => ({ ...state, OAO: OAO, ceo: ceo, seat: seat }));
  };

  useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi();
      const deroBridgeApi = deroBridgeApiRef.current;

      const [err] = await to(deroBridgeApi.init());
      if (err) {
      } else {
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
        }
        setState((state) => ({ ...state, deroBridgeApiRef: deroBridgeApiRef }));
      }
    };

    window.addEventListener("load", load);
    return () => window.removeEventListener("load", load);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input placeholder="Enter OAO SCID" id="scid"></input>
        <button type="submit">submit</button>
      </form>
      {state.OAO.version == "OAO" ? (
        <OAO OAO={state.OAO} seat={state.seat} ceo={state.ceo} />
      ) : state.OAO.version == "mOAO" ? (
        <MOAO OAO={state.OAO} seat={state.seat} ceo={state.ceo} />
      ) : (
        ""
      )}
    </>
  );
}

export default App;
