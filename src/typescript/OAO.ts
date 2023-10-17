interface OAOContract {
    version: string;
    name: string;
    treasury: Treasury;
    roles: Role[];
    users: Role[];
    mutable: boolean;
    updateFunction?: Operation;
    proposeFunction: Operation;
    storeFunction: Operation;
    voteFunction: Operation;
    withdrawFunction: Operation;
    
  }
  
  interface Role {
    tokenName: string | RegExp;
    type: RoleType;
    addressName: string | RegExp;
  }

  interface Treasury {
    treasurySearch: RegExp;
    allowanceSearch: RegExp;
    allowanceIntervalSearch?: RegExp;
    allowanceExpirySearch?: RegExp;
    assets: Asset[];
  }

  interface Asset {
    treasury: number;
    allowances: Allowance[];
  }

  interface Allowance {
    interval?: number;
    amount: number;
    role: RoleType;

  }

  interface TreasuryAsset{
    amount: number;
    allowance: number;

  }


  interface Param {
    name: String;
    datatype: String
  }

  interface Operation {
    name: string;
    params: Param[];
    access: RoleType[];
  }
  
  type RoleType = "CEO" | "Trustee" ;
  
  export function getOAOContractByVersion(version: string): OAOContract | null {
    switch (version) {
      case "1.0":
        return {
          version: "1.0",
          name: "Name",
          roles: [
            { tokenName: "CEO", type: "CEO", addressName: /^CEO\d+$Owner/ },
            { tokenName: /^SEAT_\d+$/, type: "Trustee" , addressName: /^SEAT_\d+$_OWNER/}
          ],
          treasury:{treasurySearch:/treasury/,allowanceSearch:/allowance/,assets:[]},
          users:[],
          mutable: true,
          updateFunction: {name:"Update",params:[{name:"code",datatype:"S"}],access:["CEO"]},
          proposeFunction: {name:"Propose",params:[{name:"hash",datatype:"S"},{name:"k",datatype:"S"},{name:"u",datatype:"U"},{name:"s",datatype:"S"},{name:"t",datatype:"U"},{name:"seat",datatype:"U"}],access:["CEO","Trustee"]},
          storeFunction: {name:"Store", params:[],access:["CEO","Trustee"]},
          voteFunction: {name:"Approve",params:[{name:"seat",datatype:"U"}],access:["Trustee"]},
          withdrawFunction: {name:"Withdraw", params:[{name:"amount",datatype:"U"},{name:"token",datatype:"S"}],access:["CEO"]}
          
        };
      // Add cases for other versions as needed
      default:
        return null; // Return null if version is not recognized
    }
  }
  

  