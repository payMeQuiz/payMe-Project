const {
    CROWDSALE_CONTRACT_NAME,
    TOKEN_CONTRACT_NAME, 
    TOKEN_VESTING_CONTRACT_NAME,
    WALLET,
    PRESALE_RATE,
    PRESALE_CAP,
    PRESALE_OPENING_TIME,
    PRESALE_CLOSING_TIME,
    DURATION,
    CLIFF,
    TGETIME,
    TGEPERCENTAGE
} = require("../helper-config") 

const {BigNumber} = require("ethers");

const { expect, should } = require("chai");

const { ethers, network } =  require('hardhat');

//chai.use(require('chai-bignumber')(BigNumber));

// const crowdsaleArgs = require("../arguments/crowdsale");
// const vestingArgs = require("../arguments/vesting");


describe('Crowdsales ', function(){
    let Token;
    let crowdsale;
    let testToken;
    let tokenCrowdsale;
    let tokenVesting;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let value = 10;
    let vesting;
    let openingTime;
    let closingTime;
    let afterClosingTime;
    let deployedBUSDToken;
    let maxCap = 1000;
    let totalSale;
    let tgeTime;
    let duration = 15778800;

    //"0xf5ddd805fa96b7c3d4f3ea55114f966ab9aad1de73aff48d008717b66678bb36" 
    //const ROLE = ethers.utils.soliditySha3('INVESTOR_WHITELISTED');
    const sleep = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    const ROLE = ethers.utils.solidityKeccak256(["string"],["INVESTOR_WHITELISTED"])  
    
    before(async function () {
      [owner, investor, addr2, ...addrs] = await ethers.getSigners();
      //ethers.provider.send('evm_mine');
      // openingTime = await network.provider.send('evm_mine');
      // await  network.provider.send('evm_increaseTime', [3600]);
      // closingTime =  await network.provider.send('evm_mine');
      // console.log("**************");
      // console.log(openingTime);
      // console.log(closingTime);
     // afterClosingTime = closingTime.add(time.duration.seconds(1));

      Token = await ethers.getContractFactory("payMEToken");
      tokenVesting = await ethers.getContractFactory("MockTokenVesting");
      tokenCrowdsale = await ethers.getContractFactory("payMETokenCrowdsale");
      BUSDToken = await ethers.getContractFactory("BUSDToken");

      testToken = await Token.deploy();
      await testToken.deployed();
      
      deployedBUSDToken = await BUSDToken.deploy();
      await deployedBUSDToken.deployed();

      // vesting = await tokenVesting.deploy(
      //   testToken.address,
      //   TGEPERCENTAGE,
      //   TGETIME
      //   );

        vesting = await upgrades.deployProxy(
          tokenVesting,
          [testToken.address, TGEPERCENTAGE,TGETIME],
          {initializer: "initialize"});

      await vesting.deployed();

      //console.log(...crowdsaleArgs)
      openingTime = Math.round(5+ Date.now()/1000);
      closingTime = openingTime + 30;
      tgeTime = closingTime + 30

      crowdsale = await tokenCrowdsale.deploy(
        deployedBUSDToken.address,
        vesting.address,
        PRESALE_RATE,
        WALLET,
        testToken.address,
        PRESALE_CAP,
        openingTime,
        closingTime,
        tgeTime,
        duration
      );
      await crowdsale.deployed();

      //await crowdsale.addWhitelisted(investor.address)
      // await deployedBUSDToken.transfer(ben.address, testToken.totalSupply());

      await testToken.transfer(crowdsale.address, testToken.totalSupply());
    });

    // before(async function () {
    //   //ethers.provider.send('evm_mine');
    //   openingTime = (await time.latest()).add(time.duration.weeks(1));
    //   closingTime = openingTime.add(time.duration.weeks(1));
    //   afterClosingTime = closingTime.add(time.duration.seconds(1));
    // });

    describe('accepting payments', function () {

        it('should whitelist investor', async function(){
          // console.log("**********************");
          // console.log(ROLE);  

          //await this.crowdsale.grantRole(ROLE, whitelisted, { from: whitelister });
     
          await expect( crowdsale.grantRole(ROLE,investor.address))
           .to.emit(crowdsale, `RoleGranted`)
        
        });

        // it('should purchase token', async function () {
       
        //     await expect(crowdsale.buyTokens(investor.address, { value: value }))
        //     .to.emit(crowdsale, "TokensPurchased")
        //     //ii.should.be.fulfilled;
        // });


  it('should purchase token using BUSD', async function () {

    ownerBalance = await deployedBUSDToken.balanceOf(owner.address);
    let amount = "100";
  

    //BUSDT.safeApprove(address(this), weiAmount)
    await expect(deployedBUSDToken.approve(crowdsale.address, 1200))
    .to.emit(deployedBUSDToken, "Approval")
    
    console.log("wait! Sleeping...")
    await sleep(1000*11)

    // expect(await testToken.totalSupply()).to.equal(ownerBalance);
    await expect(crowdsale.buyTokensInBUSD(investor.address, amount))
    .to.emit(crowdsale, "TokensPurchased")

    //Check investor balance
    expect(await deployedBUSDToken.balanceOf(owner.address)).to.equal(
      ownerBalance.sub(amount)
    );

    //check wallet
    expect(await deployedBUSDToken.balanceOf(WALLET))
    .to.equal(amount);

    let amount2 = 901;
    //check if investment exceeds max cap
    await expect(crowdsale.buyTokensInBUSD(investor.address, amount2))
    .to.be.revertedWithCustomError(crowdsale,"IndividuallyMaximumCappedCrowdsale")
    .withArgs(maxCap-amount);

    let amount3 = 900;
    //Buy Token Agian
    await expect(crowdsale.buyTokensInBUSD(investor.address, amount3))
    .to.emit(crowdsale, "TokensPurchased")

    totalSales = amount + amount3;

   // be.revertedWith(

   });

   it("Should pause crowdsales",async function(){
     await expect(crowdsale.pause()).to.emit(crowdsale, "Paused");
   });

   it("Should unpause crowdsales",async function(){
    await expect(crowdsale.unpause()).to.emit(crowdsale, "Unpaused");
   });

   it("Should finalize crowdsales",async function(){
      // set crowdsale address
      await vesting.setCrowdsaleAddress(crowdsale.address)


      console.log("wait! sleeping...")
      await sleep(1000*30)
      await expect(crowdsale.connect(owner).finalize()).to.emit(crowdsale, "CrowdsaleFinalized");

      //Check the number investor in the vesting contract
      expect(await vesting.getVestingSchedulesCount()).to.equal(2);
      // expect(await deployedBUSDToken.balanceOf(vesting.address))
      // .to.equal(totalSales.BigNumber);

   });

   it("Should disable buyTokens function", async function(){
     await expect(crowdsale.buyTokens(investor.address)).to.be
     .revertedWithCustomError(crowdsale, "NotAllowed");
   });

  });


});
