import hex2a from "../hex2a.js";
import { getOAOContractByVersion } from "../typescript/OAO.ts";
import { useGetSC } from "./useGetSC.jsx";

export function useParseOAO() {
  const [getSC] = useGetSC();

  const parseOAO = async (scid) => {
    const data = await getSC(scid, true, true);
    console.log("balance where", data);
    // check for version var
    let vars = data.stringkeys;
    let version = hex2a(vars?.OAO_VERSION);
    let OAO;
    if (version) {
      OAO = getOAOContractByVersion(version);
    } else {
      OAO = getOAOContractByVersion("BNB");
    }

    OAO.scid = scid;
    OAO.name = hex2a(vars?.OAO_NAME);
    OAO.code = data.code;
    OAO.balances = Object.keys(data.balances).map((x) => ({
      scid: x,
      balance: data.balances[x],
    }));

    for (var key of Object.keys(vars)) {
      if (OAO.treasury.treasurySearch.test(key)) {
        let asset = key.substring(
          OAO.treasury.treasurySearch.toString().length - 2
        );
        console.log(asset, OAO.treasury.allowanceSearch.toString());
        let allowance =
          vars[
            `${OAO.treasury.allowanceSearch.toString().slice(1, -1) + asset}`
          ];
        let allowances = [];
        if (allowance) {
          allowances.push({ amount: allowance, role: "CEO" });
        }
        OAO.treasury.assets.push({
          name: hex2a(vars[asset]),
          scid: asset,
          treasury: vars[key],
          allowances: allowances,
          balance: data.balances[asset],
        });
        /*   let asset = key.substring(9); // remove "TREASURY_" prefix
               let scid = vars[`SCID_${asset}`] || "0000000000000000000000000000000000000000000000000000000000000000";
                let amount = vars[`TREASURY_${asset}`] || 0;
                
        let allowance = vars[`ALLOWANCE_${asset}`] || 0;
           treasury[asset] = {SCID: scid, AMOUNT: amount, ALLOWANCE: allowance}; */
      }
      for (let role of OAO.roles) {
        if (role.tokenName.test(key)) {
          let index = key.substring(key.length - 1);
          console.log("index", index);
          const addressSearch =
            role.addressName.source.replace(/\\d\+/, index) + "";
          console.log("addressSearch", addressSearch);
          console.log("index", index);
          let user = {
            type: role.type,
            tokenName: hex2a(vars[key]),
            addressName: hex2a(vars[addressSearch]),
            index: index,
          };
          OAO.users.push(user);
        }
      }
    }

    OAO.proposal.key = hex2a(vars[OAO.proposal.keySearch]);
    OAO.proposal.value = hex2a(vars[OAO.proposal.valueSearch]);
    OAO.proposal.string = hex2a(vars[OAO.proposal.stringSearch]);
    OAO.proposal.uint = hex2a(vars[OAO.proposal.uintSearch]);
    OAO.proposal.hash = hex2a(vars[OAO.proposal.hashSearch]);
    OAO.proposal.quorum = vars[OAO.proposal.quorumSearch];
    OAO.proposal.approval = vars[OAO.proposal.approvalSearch];
    if (OAO.proposal.key) {
      OAO.proposal.type = "Store";
      if (OAO.proposal.value) {
        OAO.proposal.datatype = hex2a(vars[OAO.proposal.datatypeSearch]);
      } else if (OAO.proposal.string) {
        OAO.proposal.datatype = "S";
        OAO.proposal.value = OAO.proposal.string;
      } else {
        OAO.proposal.datatype = "U";
        OAO.proposal.value = OAO.proposal.uint;
      }
    } else if (OAO.proposal.hash) {
      OAO.proposal.type = "Update";
    }

    /*   console.log(OAOContract.treasury.treasurySearch)
    console.log("data",data)
    let vars = data.stringkeys
    let version = hex2a(vars.OAO_VERSION)
    let code = data.code
    let balances = data.balances
    let OAO = new Object()

    switch(version){
        case "OAO":
            console.log("OAO")
            //check code contains necessary functions


            //if match
            if(true){
                OAO.version = version
                OAO.scid = scid
                OAO.name = hex2a(vars.NAME)
                OAO.ceo = hex2a(vars.CEO)
                OAO.quorum = vars.QUORUM
                OAO.approve = vars.APPROVE
                OAO.k = vars.k
                OAO.t = vars.t
                OAO.u = vars.u
                OAO.s = vars.s
                OAO.board = []
                OAO.balances = balances
                OAO.code = code

                let seatSearch = new RegExp(`SEAT_\\d(?!_OWNER)`);

                for(var seat of Object.keys(vars)){
                    
                    if(seatSearch.test(seat)){
                        let owner = ""
                        let scid = hex2a(vars[`${seat}`])
                        if(OAO.balances[`${scid}`]){
                            owner= hex2a(vars[`${seat}_OWNER`])
                        }
                        OAO.board.push({id:parseInt(seat.substring(seat.length,seat.length-1)), scid:scid,owner:owner})
                    }
                }

                let treasurySearch = new RegExp(`TREASURY_\\w+`);

                let treasury = {};

                for(var key of Object.keys(vars)){
                     if(treasurySearch.test(key)){
                         let asset = key.substring(9); // remove "TREASURY_" prefix
                            let scid = vars[`SCID_${asset}`] || "0000000000000000000000000000000000000000000000000000000000000000";
                             let amount = vars[`TREASURY_${asset}`] || 0;
                             
                     let allowance = vars[`ALLOWANCE_${asset}`] || 0;
                        treasury[asset] = {SCID: scid, AMOUNT: amount, ALLOWANCE: allowance};
    }
}
                OAO.treasury=treasury
                console.log(OAO)
            }
                //construct oao object
            //else
                //return error
        case "mOAO":
            if(true){
                OAO.version = version
                OAO.scid = scid
                OAO.name = hex2a(vars.NAME)
                OAO.ceo = hex2a(vars.CEO)
                OAO.quorum = vars.QUORUM
                OAO.approve = vars.APPROVE
                OAO.k = vars.k
                OAO.t = vars.t
                OAO.u = vars.u
                OAO.s = vars.s
                OAO.board = []
                OAO.balances = balances
                OAO.code = code
                OAO.hash = vars.HASH

                let seatSearch = new RegExp(`SEAT_\\d(?!_OWNER)`);

                for(var seat of Object.keys(vars)){
                    
                    if(seatSearch.test(seat)){
                        let owner = ""
                        let scid = hex2a(vars[`${seat}`])
                        if(OAO.balances[`${scid}`]){
                            owner= hex2a(vars[`${seat}_OWNER`])
                        }
                        OAO.board.push({id:parseInt(seat.substring(seat.length,seat.length-1)), scid:scid,owner:owner})
                    }
                }

                let treasurySearch = new RegExp(`TREASURY_\\w+`);

                let treasury = {};

                for(var key of Object.keys(vars)){
                     if(treasurySearch.test(key)){
                         let asset = key.substring(9); // remove "TREASURY_" prefix
                            let scid = vars[`SCID_${asset}`] || "0000000000000000000000000000000000000000000000000000000000000000";
                             let amount = vars[`TREASURY_${asset}`] || 0;
                             
                     let allowance = vars[`ALLOWANCE_${asset}`] || 0;
                        treasury[asset] = {SCID: scid, AMOUNT: amount, ALLOWANCE: allowance};
    }
}
                OAO.treasury=treasury
                console.log(OAO)
            }

        default:
            console.log("default")
    }
    
    
    return OAO; */
    console.log("OAO", OAO);
    return OAO;
  };
  return [parseOAO];
}
