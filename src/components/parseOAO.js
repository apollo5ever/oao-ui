import hex2a from '../hex2a.js';
import {getOAOContractByVersion}  from '../typescript/OAO.ts'

export default function parseOAO(data,scid){
    // check for version var
    const OAOContract = getOAOContractByVersion("1.0")
    console.log(OAOContract.treasury.treasurySearch)
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
    
    
    return OAO;

    
}