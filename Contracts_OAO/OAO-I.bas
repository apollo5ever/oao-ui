/* immutable Optimal Autonomous Organization with Issue Function

The Issue Function can be used to issue tokens which can then act as keysin other contracts for example, to withdraw funds from a Private Islands fundraiser

Written by Apollo

*/
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
30 STORE("SEAT_"+seat+"_OWNER",SIGNER())
99 RETURN 0
100 RETURN 1
End Function

Function ClaimSeat(seat Uint64) Uint64
10 IF SIGNER()!= LOAD("SEAT_"+seat+"_OWNER") THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("SEAT_"+seat)))
30 IF LOAD("APPROVE") == 0 THEN GOTO 99
40 STORE("APPROVE",LOAD("APPROVE")-1)
99 RETURN 0
100 RETURN 1
End Function

Function Store(k String, u Uint64, s String) Uint64
20 IF k != LOAD("k") THEN GOTO 999
40 IF LOAD("APPROVE") < LOAD("QUORUM") THEN GOTO 999
45 STORE("APPROVE",0)
50 dim t as Uint64
60 let t = LOAD("t")
110 IF t == 0 THEN GOTO 150
120 IF t == 1 THEN GOTO 170
130 IF s!=LOAD("s") THEN GOTO 999
135 STORE(k, HEX(s))
140 RETURN 0
150 IF s!=LOAD("s") THEN GOTO 999
155 STORE(k, s)
160 RETURN 0
170 IF u!=LOAD("u") THEN GOTO 999
175 STORE(k,u)
180 RETURN 0
999 RETURN 1
End Function

Function Issue(amount Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != THEN GOTO 100
20 IF amount > LOAD("ALLOWANCE_ISSUE") THEN GOTO 100
30 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,SCID())
99 RETURN 0
100 RETURN 1
End Function