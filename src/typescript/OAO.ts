interface OAOContract {
    version: string;
    scid?: string;
    name: string;
    proposal?: Proposal;
    treasury: Treasury;
    roles: Role[];
    users: Role[];
    mutable: boolean;
    updateFunction?: Operation;
    proposeFunction: Operation;
    storeFunction: Operation;
    voteFunction: Operation;
    withdrawFunction: Operation;
    code?: string;
    
  }
  
  interface Role {
    tokenName: string | RegExp;
    type: RoleType;
    addressName: string | RegExp;
    index?: number;
  }

  interface Treasury {
    treasurySearch: RegExp;
    allowanceSearch: RegExp;
    allowanceIntervalSearch?: RegExp;
    allowanceExpirySearch?: RegExp;
    assets: Asset[];
  }

  interface Asset {
    name?:    string;
    scid:     string;
    treasury: number;
    allowances: Allowance[];
  }

  interface Allowance {
    interval?: number;
    amount: number;
    role: RoleType;

  }

  interface Proposal {
    type?: ProposalType;
    hash?: string;
    key?: string;
    value?: string | number;
    datatype?: DataType;
    string?: string;
    uint?: number;
    approval?: number;
    quorum?: number;
    hashSearch: string;
    keySearch: string;
    valueSearch?: string;
    stringSearch?: string;
    uintSearch?: string;
    datatypeSearch: string;
    approvalSearch: string;
    quorumSearch: string;
  }

  interface Param {
    name: string;
    datatype: DataType;
    label:    string;
    value?:   string | number;
  }

  interface Operation {
    name: string;
    params: Param[];
    access: RoleType[];
  }
  
  type RoleType = "CEO" | "Trustee" ;
  type ProposalType = "Update" | "Store"
  type DataType = "U" | "S"
  
  export function getOAOContractByVersion(version: string): OAOContract | null {
    switch (version) {
      case "BNB":
        return {
          version: "BNB",
          name: "OAO_NAME",
          proposal:{hashSearch:"HASH",keySearch:"k",stringSearch:"s", uintSearch: "u",datatypeSearch:"t",approvalSearch:"APPROVE",quorumSearch:"QUORUM"},
          roles: [
            { tokenName: /CEO/, type: "CEO", addressName: /CEO\d+Owner/ },
            { tokenName: /SEAT_\d+$/, type: "Trustee" , addressName: /SEAT_\d+_OWNER/}
          ],
          treasury:{treasurySearch:/treasury/,allowanceSearch:/allowance/,assets:[]},
          users:[],
          mutable: true,
          updateFunction: {name:"Update",params:[{name:"code",datatype:"S",label:"code"}],access:["CEO"]},
          proposeFunction: {name:"Propose",params:[{name:"hash",datatype:"S",label:"hash"},{name:"k",datatype:"S",label:"key"},{name:"u",datatype:"U",label:"Uint64 Value"},{name:"s",datatype:"S",label:"String Value"},{name:"t",datatype:"U",label:"datatype"},{name:"seat",datatype:"U",label:"seat"}],access:["CEO","Trustee"]},
          storeFunction: {name:"Store", params:[],access:["CEO","Trustee"]},
          voteFunction: {name:"Approve",params:[{name:"seat",datatype:"U",label:"seat"}],access:["Trustee"]},
          withdrawFunction: {name:"Withdraw", params:[{name:"amount",datatype:"U",label:"Amount"},{name:"token",datatype:"S",label:"Token"}],access:["CEO"]}
          
        };

        case "PI":
          return {
            version: "PI",
            name: "OAO_NAME",
            proposal:{hashSearch:"HASH",keySearch:"k",valueSearch:"v",datatypeSearch:"t",approvalSearch:"APPROVE",quorumSearch:"QUORUM"},
            roles: [
              { tokenName: /CEO/, type: "CEO", addressName: /CEO\d+Owner/ },
              { tokenName: /seat\d+$/, type: "Trustee" , addressName: /trustee\d+/}
            ],
            treasury:{treasurySearch:/treasury/,allowanceSearch:/allowance/,assets:[]},
            users:[],
            mutable: true,
            updateFunction: {name:"Update",params:[{name:"code",datatype:"S",label:"code"}],access:["CEO"]},
            proposeFunction: {name:"Propose",params:[{name:"hash",datatype:"S",label:"hash"},{name:"k",datatype:"S",label:"key"},{name:"u",datatype:"U",label:"Uint64 Value"},{name:"s",datatype:"S",label:"String Value"},{name:"t",datatype:"U",label:"datatype"},{name:"seat",datatype:"U",label:"seat"}],access:["CEO","Trustee"]},
            storeFunction: {name:"Store", params:[],access:["CEO","Trustee"]},
            voteFunction: {name:"Approve",params:[{name:"seat",datatype:"U",label:"seat"}],access:["Trustee"]},
            withdrawFunction: {name:"Withdraw", params:[{name:"amount",datatype:"U",label:"Amount"},{name:"token",datatype:"S",label:"Token"}],access:["CEO"]}
            
          }; 
      // Add cases for other versions as needed
      default:
        return null; // Return null if version is not recognized
    }
  }
  

  