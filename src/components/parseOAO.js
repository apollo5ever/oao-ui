

export default function parseOAO(data){
    // check for version var
    let version = data.stringkeys.OAO_VERSION
    let OAO = new Object()

    switch(version){
        case "OAO":
            console.log("OAO")
            //check code contains necessary functions

            //if match
                //construct oao object
            //else
                //return error
        default:
            console.log("default")
    }
    
    
    return OAO;

    
}