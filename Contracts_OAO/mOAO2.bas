/* Optimal Autonomous Organization with Update Function

The Update Function allows the contract to be updated with Board-approved code
Written by Apollo

*/
Function Propose(hash String, k String, u Uint64, s String, t Uint64, seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 13
11 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
12 GOTO 15
13 IF ASSETVALUE(HEXDECODE(LOAD("seat"+seat))) !=1 THEN GOTO 100
14 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("seat"+seat)))
15 STORE("APPROVE", 0)
20 IF hash =="" THEN GOTO 40
25 STORE("HASH",hash)
30 STORE("k","")
35 RETURN 0
40 STORE("k",k)
45 STORE("HASH","")
49 STORE("t",t)
50 IF t == 1 THEN GOTO 80
60 STORE("s", s)
70 RETURN 0
80 STORE("u",u)
90 RETURN 0
100 RETURN 1
End Function

Function Approve(seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("seat"+seat)))!=1 THEN GOTO 100
20 STORE("APPROVE",LOAD("APPROVE")+1)
30 STORE("seat"+seat+"Owner",SIGNER())
99 RETURN 0
100 RETURN 1
End Function

Function ClaimSeat(seat Uint64) Uint64
10 IF SIGNER()!= LOAD("seat"+seat+"Owner") THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("seat"+seat)))
30 IF LOAD("APPROVE") == 0 THEN GOTO 99
40 STORE("APPROVE",LOAD("APPROVE")-1)
99 RETURN 0
100 RETURN 1
End Function

Function Update(code String) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO")))!=1 THEN GOTO 100
15 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
20 IF SHA256(code) != HEXDECODE(LOAD("HASH")) THEN GOTO 100
30 IF LOAD("APPROVE") < LOAD("QUORUM") THEN GOTO 100
40 UPDATE_SC_CODE(code)
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

//thinking about new allowance system
//vars:
//allowance interval
//one-time allowance
//x-ly allowance as amount
//x-ly allowance as % of treasury
//min(amount,%)
//example:
//ceo has monthly allowance of 500 dero or 25% of treasury, whichever is smaller
//ceo is approved for one-time withdrawl of 333 dero which does not affect his monthly allowance
// a system like this means less board votes

Function Withdraw(amount Uint64, token String, special Uint64) Uint64
1 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 100
2 IF special ==1 THEN GOTO
3 IF amount > LOAD("allowance"+token) THEN GOTO 100
4 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,HEXDECODE(LOAD(token)))
5 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
6 STORE("withdrawl"+LOAD("withdrawlCount"),TXID())
7 STORE("withdrawlCount",LOAD("withdrawlCount")+1)
8 STORE("lastWithdrawl",BLOCK_TIMESTAMP())
9 
10 IF token != "" THEN GOTO 21
11 IF amount > LOAD("allowanceDERO") THEN GOTO 100
12 SEND_DERO_TO_ADDRESS(SIGNER(),amount)
13 STORE("allowanceDERO",LOAD("allowanceDERO") - amount)
14 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
15 STORE("treasuryDERO",LOAD("treasuryDERO")-amount)
19 RETURN 0
21 IF amount > LOAD("allowance"+token) THEN GOTO 100
22 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,HEXDECODE(LOAD(token)))
23 STORE("allowance"+token,LOAD("allowance"+token) - amount)
24 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
25 STORE("treasury"+token,LOAD("treasury"+token)-amount)
29 RETURN 0
100 RETURN 1
End Function

Function Withdraw(amount Uint64, token String, special Uint64) Uint64
1 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 99
2 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
3 IF special ==1 THEN GOTO 20
4 IF amount > LOAD("treasury"+token) THEN GOTO 99
5 IF BLOCK_TIMESTAMP() < LOAD("allowanceRefresh"+token) THEN GOTO 8
6 STORE("allowanceRefresh"+token,BLOCK_TIMESTAMP()+LOAD("allowanceInterval"+token))
7 STORE("allowanceUsed"+token,0)
8 IF amount + LOAD("allowanceUsed"+token) > LOAD("allowance"+token) THEN GOTO 99
9 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,HEXDECODE(LOAD(token)))
10 STORE("allowanceUsed"+token,LOAD("allowanceUsed"+token)+amount)
11 STORE("treasury"+token,LOAD("treasury"+token)-amount)
19 RETURN 0
20 IF LOAD("allowanceSpecial"+token) > LOAD("treasury"+token) THEN GOTO 99
21 SEND_ASSET_TO_ADDRESS(SIGNER(),LOAD("allowanceSpecial"+token),HEXDECODE(LOAD(token)))
22 STORE("treasury"+token,LOAD("treasury"+token)-LOAD("allowanceSpecial"+token))
23 DELETE("allowanceSpecial"+token)
98 RETURN 0
99 RETURN 1
End Function

Function Deposit(token String) Uint64
30 STORE("treasury"+token,LOAD("treasury"+token)+ASSETVALUE(HEXDECODE(LOAD(token))))
99 RETURN 0
End Function