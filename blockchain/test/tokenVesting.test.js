const { expect } = require("chai");
const {currentTime, moveTime} = require("../helper.ts");
const {
  TGEPERCENTAGE,
  TGETIME
} = require("../helper-config");

describe("payMETokenVesting", function () {
  let Token;
  let testToken;
  let TokenVesting;
  let owner;
  let addrs;
  let ownerBalance;
  // let tokenVesting;
  let baseTime = 1662011895;
  let duration = 10000;
  let amount = 100

  const deployVestingToken = async function(TokenVesting){
    tokenVesting = await upgrades.deployProxy(
      TokenVesting,
      [testToken.address, TGEPERCENTAGE,TGETIME],
      {initializer: "initialize"});

     const e = await tokenVesting.deployed();
     return e;
  }
  
  const createVestingSchedule = async function(
    deployedTokenVesting,
    startTime = baseTime,
    cliff = 0,
    _duration = duration,
    slicePeriodSeconds = 1,
    revokable = true,
    _amount = amount,
    _releaseAtTGE = true,
  ){
    // create new vesting schedule
    return await deployedTokenVesting.createVestingSchedule(
      beneficiary1.address,
      startTime,
      cliff,
      _duration,
      slicePeriodSeconds,
      revokable,
      _amount,
      _releaseAtTGE
    );
  }

  before(async function () {

    Token = await ethers.getContractFactory("payMEToken");
    TokenVesting = await ethers.getContractFactory("MockTokenVesting");

  });

  beforeEach(async function () {
    // console.log("Running 2");
    [owner,  beneficiary1, beneficiary2, addr1, ...addrs] = await ethers.getSigners();
    
    // console.log(`beneficiary1 ${beneficiary1.address}`);
    // console.log(`beneficiary2 ${beneficiary2.address}`);

    
    testToken = await Token.deploy();
    await testToken.deployed();




    ownerBalance = await testToken.balanceOf(owner.address);
    //console.log(`owner balance: ${ ownerBalance }`);



  });

  describe("Vesting", function () {

    it("Should assign the total supply of tokens to the owner", async function () {
      console.log("Running 4");
      ownerBalance = await testToken.balanceOf(owner.address);
      expect(await testToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should tranfer total supply to vesting contract", async function(){
            // send tokens to vesting contract
        const tokenVesting = await deployVestingToken(TokenVesting)

        await expect(testToken.transfer(tokenVesting.address, ownerBalance))
            .to.emit(testToken, "Transfer")
            .withArgs(owner.address, tokenVesting.address, ownerBalance);

          const vestingContractBalance = await testToken.balanceOf(
            tokenVesting.address
          );
          expect(vestingContractBalance).to.equal(ownerBalance);
          expect(await tokenVesting.getWithdrawableAmount()).to.equal(ownerBalance);
    });

    it("Should vest tokens gradually", async function () {
      // deploy vesting contruhjhact
      const tokenVesting = await upgrades.deployProxy(
        TokenVesting,
        [testToken.address, TGEPERCENTAGE,TGETIME],
        {initializer: "initialize"});
  
       const e = await tokenVesting.deployed();
      
      //Send Token to Vesting Contract 
      await testToken.transfer(tokenVesting.address, ownerBalance)
      const vestingContractBalance = await testToken.balanceOf(
        tokenVesting.address
      );
      expect(vestingContractBalance).to.equal(ownerBalance);
      expect(await tokenVesting.getWithdrawableAmount()).to.equal(ownerBalance);
      
      //Check Token Address
      expect((await tokenVesting.getToken()).toString()).to.equal(
        testToken.address
      );




       //Create Vesting Schedul 
       await expect(tokenVesting.connect(owner).createVestingSchedule(
        beneficiary1.address,
        baseTime,
        0,
        duration,
        1,
        true,
        amount,
        true
      )).to.emit(tokenVesting, "VestingScheduleCreated");
      expect(await tokenVesting.getVestingSchedulesCount()).to.be.equal(1);
      expect(
        await tokenVesting.getVestingSchedulesCountByBeneficiary(
          beneficiary1.address
        )
      ).to.be.equal(1);

      // compute vesting schedule id
      const vestingScheduleId =
      await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
        beneficiary1.address,
        0
      );

      // check that vested amount is 0
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await tokenVesting.setCurrentTime(halfTime);

      // check that vested amount is half the total amount to vest
      expect(
        await tokenVesting
          .connect(beneficiary1)
          .computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(50);

      // check that only beneficiary can try to release vested tokens
      await expect(
        tokenVesting.connect(addr1).release(vestingScheduleId, 100)
      ).to.be.revertedWith(
        "TokenVesting: only beneficiary and owner can release vested tokens"
      );

      // check that beneficiary cannot release more than the vested amount
      await expect(
        tokenVesting.connect(beneficiary1).release(vestingScheduleId, 100)
      ).to.be.revertedWith(
        "TokenVesting: cannot release tokens, not enough vested tokens"
      );
      
      // release 10 tokens and check that a Transfer event is emitted with a value of 10
      await expect(
        tokenVesting.connect(beneficiary1).release(vestingScheduleId, 10)
      )
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, beneficiary1.address, 10);

              // check that the vested amount is now 40
      expect(
        await tokenVesting
          .connect(beneficiary1)
          .computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(40);

      let vestingSchedule = await tokenVesting.getVestingSchedule(
        vestingScheduleId
      );

      // check that the released amount is 10
      expect(vestingSchedule.released).to.be.equal(10);

      // set current time after the end of the vesting period
      await tokenVesting.setCurrentTime(baseTime + duration + 1);

      // check that the vested amount is 90
      expect(
        await tokenVesting
          .connect(beneficiary1)
          .computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(90);

      // beneficiary release vested tokens (45)
      await expect(
        tokenVesting.connect(beneficiary1).release(vestingScheduleId, 45)
      )
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, beneficiary1.address, 45);

      // owner release vested tokens (45)
      await expect(tokenVesting.connect(owner).release(vestingScheduleId, 45))
      .to.emit(testToken, "Transfer")
      .withArgs(tokenVesting.address, beneficiary1.address, 45);

    vestingSchedule = await tokenVesting.getVestingSchedule(
      vestingScheduleId
    );

    // check that the number of released tokens is 100
    expect(vestingSchedule.released).to.be.equal(100);

    // check that the vested amount is 0
    expect(
      await tokenVesting
        .connect(beneficiary1)
        .computeReleasableAmount(vestingScheduleId)
    ).to.be.equal(0);

    // check that anyone cannot revoke a vesting
    await expect(
      tokenVesting.connect(beneficiary1).revoke(vestingScheduleId)
    ).to.be.revertedWith("Ownable: caller is not the owner");
   
    await tokenVesting.revoke(vestingScheduleId);
  
      /*
       * TEST SUMMARY
       * deploy vesting contract
       * send tokens to vesting contract
       * create new vesting schedule (100 tokens)
       * check that vested amount is 0
       * set time to half the vesting period
       * check that vested amount is half the total amount to vest (50 tokens)
       * check that only beneficiary can try to release vested tokens
       * check that beneficiary cannot release more than the vested amount
       * release 10 tokens and check that a Transfer event is emitted with a value of 10
       * check that the released amount is 10
       * check that the vested amount is now 40
       * set current time after the end of the vesting period
       * check that the vested amount is 90 (100 - 10 released tokens)
       * release all vested tokens (90)
       * check that the number of released tokens is 100
       * check that the vested amount is 0
       * check that anyone cannot revoke a vesting
       */
    });

    // it("should be irrevokable by another benefinary", async function(){
    //   //await testToken.transfer(tokenVesting.address, ownerBalance)

    //         // check that anyone cannot revoke a vesting
    //               // compute vesting schedule id
    //   const vestingScheduleId =
    //   await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
    //     beneficiary1.address,
    //     0
    //   );
    //         await expect(
    //           tokenVesting.connect(beneficiary2).revoke(vestingScheduleId)
    //         ).to.be.revertedWith("Ownable: caller is not the owner");
    //         await tokenVesting.revoke(vestingScheduleId);


      
    // });


    it("Should release vested tokens if revoked", async function () {

      const tokenVesting = await deployVestingToken(TokenVesting)

      await testToken.transfer(tokenVesting.address, ownerBalance)

      //Create Vesting Schedule
      await createVestingSchedule(tokenVesting)

      // compute vesting schedule id
      const vestingScheduleId =
        await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary1.address,
          0
        );

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await tokenVesting.setCurrentTime(halfTime);

      await expect(tokenVesting.revoke(vestingScheduleId))
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, beneficiary1.address, 50);
    });

    it("Should compute vesting schedule index", async function () {
      const tokenVesting = await deployVestingToken(TokenVesting)

    
      const expectedVestingScheduleId =
        "0xa279197a1d7a4b7398aa0248e95b8fcc6cdfb43220ade05d01add9c5468ea097";
      expect(
        (
          await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
            beneficiary1.address,
            0
          )
        ).toString()
      ).to.equal(expectedVestingScheduleId);
      expect(
        (
          await tokenVesting.computeNextVestingScheduleIdForHolder(
            beneficiary1.address
          )
        ).toString()
      ).to.equal(expectedVestingScheduleId);
    });

    it("Should check input parameters for createVestingSchedule method", async function () {
      const tokenVesting = await deployVestingToken(TokenVesting)

      await testToken.transfer(tokenVesting.address, 1000);
      const time = Date.now();
      await expect(
        tokenVesting.createVestingSchedule(
          beneficiary1.address,
          time,
          0,
          0,
          1,
          false,
          1,
          true
        )
      ).to.be.revertedWith("TokenVesting: duration must be > 0");
      await expect(
        tokenVesting.createVestingSchedule(
          beneficiary1.address,
          time,
          0,
          1,
          0,
          false,
          1,
          true
        )
      ).to.be.revertedWith("TokenVesting: slicePeriodSeconds must be >= 1");
      await expect(
        tokenVesting.createVestingSchedule(
          beneficiary1.address,
          time,
          0,
          1,
          1,
          false,
          0,
          true
        )
      ).to.be.revertedWith("TokenVesting: amount must be > 0");
    });

    it("Should release "+TGEPERCENTAGE+"% at TGE", async function(){

      const tokenVesting = await deployVestingToken(TokenVesting)


      await testToken.transfer(tokenVesting.address, ownerBalance)

      //Create Vesting Schedule
      await createVestingSchedule(tokenVesting);



      const vestingScheduleId =
      await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
        beneficiary1.address,
        0
      );
     
      //console.log(ree);
      let percentage = (amount*TGEPERCENTAGE)/100;

      //Check that only user can claim token
      await expect( tokenVesting.connect(beneficiary2).releaseTokenForTGE(vestingScheduleId))
      .to.be
      .revertedWith("TokenVesting: only beneficiary and owner can release vested tokens");

      //Check that token can only be claimed on or after TGE time
      await tokenVesting.setCurrentTime(baseTime-TGETIME);
      await expect( tokenVesting.releaseTokenForTGE(vestingScheduleId))
      .to.be
      .revertedWith("TGE: time not reached!");


      await tokenVesting.setCurrentTime(baseTime);

      await expect( tokenVesting.releaseTokenForTGE(vestingScheduleId))
        .to.emit(tokenVesting, "TokenReleasedAtTGE")
        .withArgs(beneficiary1.address,percentage);

      //Check that user now have the balance
      expect(await testToken.balanceOf(beneficiary1.address))
      .to.equal(percentage);

      //Check that beneficiary cannot claim TGE token Again
      await expect(tokenVesting.releaseTokenForTGE(vestingScheduleId))
      .to.be
      .revertedWith("TGE: Token Already claimed");
      
    });

    // it("Claiming tokens", async function(){

    // });




  });


});


