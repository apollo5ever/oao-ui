import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CEO from "./components/ceo";
import Search from "./components/search";

function App() {
  const [count, setCount] = useState(0);

  //if user has loaded up contract using search component then state object will contain things like CEO, SEAT_1, QUORUM, APPROVAL
  //user's balance will be checked for CEO and Board tokens
  //if user has multiple roles, display role switcher to let user choose active role

  return (
    <>
      <Search />

      <CEO />
    </>
  );
}

export default App;
