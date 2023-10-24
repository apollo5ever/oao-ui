import { useContext, useState, useRef, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CEO from "./components/ceo";
import Search from "./components/search";
import { useGetSC } from "./hooks/useGetSC";
import { useParseOAO } from "./hooks/useParseOAO";
import { useRPCWallet } from "./hooks/useRPCWallet";
import { LoginContext } from "./LoginContext";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";
import { useGetBalance } from "./hooks/useGetBalance";
import hex2a from "./hex2a";
import OAO from "./components/OAO";
import MOAO from "./components/mOAO";
import "bootstrap/dist/css/bootstrap.min.css";
import WebSocketService from "./webSocketService";
import WalletToggle from "./components/rpcToggle";
import DaemonToggle from "./components/daemonToggle";
import { useGetAddress } from "./hooks/useGetAddress";
import { useGetRole } from "./hooks/useGetRole";
import { useInitializeWallet } from "./hooks/useInitializeWallet";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  InputGroup,
} from "react-bootstrap";
import SaveOAO from "./components/saveOAO";

function App() {
  const [count, setCount] = useState(0);
  const [getRole] = useGetRole();
  const [getSC] = useGetSC();
  const [getBalance] = useGetBalance();
  const [state, setState] = useContext(LoginContext);
  const deroBridgeApiRef = useRef();
  const [socketService, setSocketService] = useState(null);
  const [getAddress] = useGetAddress();
  const [parseOAO] = useParseOAO();
  const [initializeWallet] = useInitializeWallet();
  //const [walletInfo, isLoading, error, fetchWalletInfo] = useRPCWallet();

  //if user has loaded up contract using search component then state object will contain things like CEO, SEAT_1, QUORUM, APPROVAL
  //user's balance will be checked for CEO and Board tokens
  //if user has multiple roles, display role switcher to let user choose active role

  useEffect(() => {
    initializeWallet();
  }, []);

  useEffect(() => {
    const setRole = async () => {
      const role = await getRole(state.OAO.users);
      setState((state) => ({ ...state, role: role }));
    };
    setRole();
  }, [state.OAO, state.walletMode, state.userAddress]);

  /*   useEffect(() => {
    const ws = new WebSocketService("ws://localhost:44326/xswd");
    setSocketService(ws);
    setState((state) => ({ ...state, ws: ws }));
    console.log("ws", ws);
  }, []); */

  /*   useEffect(() => {
    const payload = {
      id: "ed606a2f4c4f499618a78ff5f7c8e51cd2ca4d8bfa7e2b41a27754bb78b1df1f",
      name: "OAO Dashboard",
      description: "Optimal Autonomous Organization Made Easy",
      url: "https://dero.ao",
    };

    try {
      socketService.sendPayload(payload);
    } catch (error) {
      console.error("Error sending payload:", error);
    }
  }, [state]); */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let address = await getAddress();
    } catch (error) {
      console.log(error);
    }

    console.log(e.target.scid.value);
    /*  let sc = await getSC(e.target.scid.value, true, true);
    console.log(sc); */

    let OAO = await parseOAO(e.target.scid.value);
    console.log(OAO.users);
    const role = await getRole(OAO.users);
    console.log("role ", role);
    setState((state) => ({ ...state, OAO: OAO, role: role }));
  };

  /*   useEffect(() => {
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
  }, []); */

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Dero OAO Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Form noValidate onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Enter OAO SCID"
                aria-label="SCID"
                aria-describedby="basic-addon2"
                id="scid"
              />
              <Button type="submit" variant="outline-secondary">
                Fetch
              </Button>
            </InputGroup>
          </Form>
          <SaveOAO />
        </Navbar.Collapse>
        <div className="d-flex flex-column">
          <WalletToggle />
          <DaemonToggle />
        </div>
      </Navbar>
      {state.OAO.version && <MOAO OAO={state.OAO} role={state.role} />}
    </>
  );
}

export default App;
