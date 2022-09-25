# payME Initial coin offering (ICO) 

This contract allows investors and purchase payME tokens, This Exchange is done using a stablecoin called BUSD. 

## PayME-Token Crowdsales

This contract is responsible for allowing investors that have been whitelisted to take part in the crowdsales of the payME ecosystem.
There is an opening time from which investors can start investing, after the closing time no investor will be allowed to participate in the crowd sales. 

After the closing time, the smart contract owner can now call the finalize() function. This function automatically creates vesting schedules for all investors that have participated in the crowd sale. vesting schedules contains five(5) critical parameter. which includes: investor wallet address, Token Generation time, Cliff, Duration, Time slice, Irrevocable, investment amount, Token Generation Event claimable.

### Constraints:

    1. Investor is whitelisted
    2. Investors can only participate within the set time
    3. Investors can only invest if Capped Crowd sales are not reached
    4. Investors can only participate if crowd sales are not paused by the owner
    5. Owner can only finalize crowd sales when token sales elapse
    6. Investor must have the total of the specified amount in BUSD
    7. Investors can only invest if he/she is willing to invest a set Minimum amount
    8. Investors can only invest if the individual maximum cap is not reached

### BuyTokens():

This inherited function has been disabled because we want investors to only be able to invest  using a stablecoin(BUSD)

### buyTokensInBUSD():

> Steps:

    1. Input beneficiary wallet address and amount
    2. Check constraints
    3. Send funds to the founder’s wallet
    4. Add investor and beneficiary to the  pool of investment
    5. Increase beneficiary contribution amount


### finalize():

> Steps:

    1. Owner calls the function
    2. Send raised payME Token to vesting contract
    3. Create vesting schedules for each investment. 

