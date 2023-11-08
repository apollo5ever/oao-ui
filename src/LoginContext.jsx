import React, { useState } from "react";

const LoginContext = React.createContext([{}, () => {}]);
//const walletListCookie = Cookies.get('walletList');

const LoginProvider = (props) => {
  const [state, setState] = useState({
    walletMode: "rpc",
    daemonMode: "pools",
    OAO: {},
    ceo: 0,
    seat: -1,
    userRole: "user",
  });
  return (
    <LoginContext.Provider value={[state, setState]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
