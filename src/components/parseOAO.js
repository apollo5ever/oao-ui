import hex2a from '../hex2a.js';

export default function parseOAO(data,scid){
    // check for version var
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
                OAO.treasury_dero = vars.TREASURY_DERO 
                OAO.balances = balances

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
                console.log(OAO)
            }
                //construct oao object
            //else
                //return error
        default:
            console.log("default")
    }
    
    
    return OAO;

    
}