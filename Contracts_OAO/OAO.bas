/* immutable Optimal Autonomous Organization

Written by Apollo

*/
Function Initialize(CEO String, NAME String) Uint64
10 IF EXISTS("CEO") THEN GOTO 100
20 STORE("CEO",CEO)
30 STORE("QUORUM",0)
40 STORE("TREASURY_DERO",0)
50 STORE("APPROVE", 0)
60 STORE("ALLOWANCE_DERO",0)
70 STORE("OAO_VERSION","OAO")
80 STORE("NAME",NAME)
99 RETURN 0
100 RETURN 1
End Function

Function Propose(k String, u Uint64, s String, t Uint64, seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 13
11 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
12 GOTO 15
13 IF ASSETVALUE(HEXDECODE(LOAD("SEAT_"+seat))) !=1 THEN GOTO 100
14 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("SEAT_"+seat)))
15 STORE("APPROVE", 0)
40 STORE("k",k)
49 STORE("t",t)
50 IF t == 1 THEN GOTO 80
60 STORE("s", s)
70 RETURN 0
80 STORE("u",u)
90 RETURN 0
100 RETURN 1
End Function

Function Approve(seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("SEAT_"+seat)))!=1 THEN GOTO 100
20 STORE("APPROVE",LOAD("APPROVE")+1)
30 STORE("SEAT_"+seat+"_OWNER",ADDRESS_STRING(SIGNER()))
99 RETURN 0
100 RETURN 1
End Function

Function ClaimSeat(seat Uint64) Uint64
10 IF ADDRESS_STRING(SIGNER())!= LOAD("SEAT_"+seat+"_OWNER") THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("SEAT_"+seat)))
30 IF LOAD("APPROVE") == 0 THEN GOTO 99
40 STORE("APPROVE",LOAD("APPROVE")-1)
99 RETURN 0
100 RETURN 1
End Function

Function Store() Uint64
10 IF LOAD("APPROVE") < LOAD("QUORUM") THEN GOTO 100
20 STORE("APPROVE",0)
30 IF LOAD("t") == 1 THEN GOTO 60
40 STORE(LOAD("k"), LOAD("s"))
45 STORE("k","")
50 RETURN 0
60 STORE(LOAD("k"),LOAD("u"))
65 STORE("k","")
99 RETURN 0
100 RETURN 1
End Function

Function Withdraw(amount Uint64, token String) Uint64
5 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 100
10 IF token != "" THEN GOTO 21
11 IF amount > LOAD("ALLOWANCE_DERO") THEN GOTO 100
12 SEND_DERO_TO_ADDRESS(SIGNER(),amount)
13 STORE("ALLOWANCE_DERO",LOAD("ALLOWANCE_DERO") - amount)
14 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
15 STORE("TREASURY_DERO",LOAD("TREASURY_DERO")-amount)
19 RETURN 0
21 IF amount > LOAD("ALLOWANCE_"+token) THEN GOTO 100
22 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,HEXDECODE(LOAD(token)))
23 STORE("ALLOWANCE_"+token,LOAD("ALLOWANCE_"+token) - amount)
24 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
25 STORE("TREASURY_"+token,LOAD("TREASURY_"+token)-amount)
29 RETURN 0
100 RETURN 1
End Function

Function Deposit(token String) Uint64
10 STORE("TREASURY_DERO",LOAD("TREASURY_DERO")+DEROVALUE())
20 IF token != "" THEN GOTO 30
25 RETURN 0
30 STORE("TREASURY_"+token,LOAD("TREASURY_"+token)+ASSETVALUE(HEXDECODE(LOAD(token))))
99 RETURN 0
End Function