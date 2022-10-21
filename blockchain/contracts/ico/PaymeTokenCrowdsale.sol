// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../crowdsale/Crowdsale.sol";
import "../crowdsale/validation/WhitelistCrowdsale.sol";
import "../crowdsale/validation/TimedCrowdsale.sol";
import "../crowdsale/validation/CappedCrowdsale.sol";
import "../crowdsale/validation/PausableCrowdsale.sol";
import "../crowdsale/distribution/FinalizableCrowdsale.sol";

import "../ico/PaymeTokenVesting.sol";

error InsufficientBalance(uint256 balance, uint256 expected);
error IndividuallyMinimumCappedCrowdsale(uint256);
error IndividuallyMaximumCappedCrowdsale(uint256);
error NotAllowed(address);


contract PaymeTokenCrowdsale is Ownable, 
CappedCrowdsale, TimedCrowdsale, WhitelistCrowdsale, 
FinalizableCrowdsale, PausableCrowdsale  {
   
   using SafeERC20 for IERC20;

   using SafeMath for uint256;

   address public vestingAddress;

   IERC20 public BUSDT;

   uint256 public TGETime;

   uint256 public cliff;

   uint256 public duration;

   uint256 public minimumSale;

   uint256 public maximumSale;

    // The Project Team comprises 10% of the Max supply.
    // Technical Developers comprise 5% of the Max supply.
    // Business Development comprises 20% of the Max supply, 

   //Percentage
   uint256 public projectTeamPercentage = 10;
   uint256 public techincalDevelopersPercentage = 5;
   uint256 public businessDevelopmentPercentage = 20;

   //Vesting contract 
    // PaymeTokenVesting public projectTeamVesting;
    // PaymeTokenVesting public techincalDevelopersVesting;
    // PaymeTokenVesting public businessDevelopmentVesting; 

   Investor[] private investors;

   mapping(address => uint256) private _contributions;

   struct Investor{
       address investor;
       uint256 investment;
   }

   //Amount of BUSD
   uint256 public USDTRaised; 

   constructor(
        IERC20 _BUSDT,
        address _vestingAddress,
        uint256 rate,    // rate in PayME
        address payable wallet,
        IERC20 _token,
        uint256 _cap,
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _TGETime,
        uint256 _duration
        
    )
        Crowdsale(rate, wallet, _token ) 
        CappedCrowdsale(_cap)
        TimedCrowdsale(_openingTime, _closingTime)
        
    {
        BUSDT = _BUSDT;
        TGETime = _TGETime;
        cliff = 0;
        duration = _duration;
        vestingAddress = _vestingAddress;
        minimumSale = 100;
        maximumSale = 1000;

    }

    function buyTokensInBUSD(address beneficiary, uint256 amount) public nonReentrant payable {
        uint256 weiAmount = amount;
        _preValidatePurchase(beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        BUSDT.safeTransferFrom(msg.sender, wallet(), weiAmount);

        // update state
        //_weiRaised = _weiRaised.add(weiAmount);

        _processPurchase(beneficiary, tokens);
        
        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);

        _updatePurchasingState(beneficiary, weiAmount);

        _forwardFunds();
        _postValidatePurchase(beneficiary, weiAmount);
    }

    function buyTokens(address beneficiary) override  public nonReentrant payable {
        revert NotAllowed(beneficiary);
    }

    function _forwardFunds(uint256 amount) internal {
        //BUSDT.transfer(wallet(), amount);
        //_wallet.transfer(msg.value);
        //Funds are automatically sent to the wallet
    }

    

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) 
    internal 
    override(CappedCrowdsale, PausableCrowdsale, WhitelistCrowdsale, TimedCrowdsale)
    view {
        uint256 beneficiaryBalance = BUSDT.balanceOf(msg.sender);

        //Ensure that team owner has funds to create challenge
        if (weiAmount > beneficiaryBalance) {
          revert InsufficientBalance(beneficiaryBalance, weiAmount);
        }

        //Set Max and Min Purchase
        if(weiAmount < minimumSale){
            revert IndividuallyMinimumCappedCrowdsale(weiAmount);
        }
        
        if(_contributions[beneficiary].add(weiAmount) > maximumSale){
            revert IndividuallyMaximumCappedCrowdsale(maximumSale.sub(_contributions[beneficiary]));
        }

        super._preValidatePurchase(beneficiary, weiAmount);
    }

    function createInvestor(address beneficiary, uint256 tokenAmount) internal{
                
                investors.push(Investor(
                            beneficiary,
                            tokenAmount
                ));
    }

    

    function _processPurchase(address beneficiary, uint256 tokenAmount) 
    override
    internal {
        createInvestor(beneficiary, tokenAmount);
    }

    /**
     * @dev Extend parent behavior to update beneficiary contributions.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _updatePurchasingState(address beneficiary, uint256 weiAmount) override internal {
        super._updatePurchasingState(beneficiary, weiAmount);
        _contributions[beneficiary] = _contributions[beneficiary].add(weiAmount);
    }

    /**
     * @dev Can be overridden to add finalization logic. The overriding function
     * should call super._finalization() to ensure the chain of finalization is
     * executed entirely.
     */
    function _finalization() override internal {
        //TODO: Creating Vesting Shedule for others: technical team, director, e.t.c
        IERC20  paymeToken = token();

        uint256 totalSupply = paymeToken.totalSupply();

        // uint256  projectTeamPercentage = 10;
        // uint256  techincalDevelopersPercentage = 5;
        // uint256  businessDevelopmentPercentage = 20;

        uint256 totalWei =  weiRaised();
        uint256 tokenRate = rate();

        //projectTeamVesting = new PaymeTokenVesting(paymeToken,0,0);
        //techincalDevelopersVesting  = new PaymeTokenVesting(paymeToken,0,0);
        //businessDevelopmentVesting = new PaymeTokenVesting(paymeToken,0,0);
        
        uint256 ptShare = totalSupply.mul(projectTeamPercentage).div(100);
        uint256 tdShare = totalSupply.mul(techincalDevelopersPercentage).div(100);
        uint256 bdShare = totalSupply.mul(businessDevelopmentPercentage).div(100);
        uint256 totalShare = ptShare.add(tdShare).add(bdShare);
        uint256 totalSales = totalWei.mul(tokenRate);
        
        //Send raised Payme Token to vesting contract
        paymeToken.safeTransfer(vestingAddress, totalShare.add(totalSales));
         
        PaymeTokenVesting vesting = PaymeTokenVesting(vestingAddress);

        //Create Vesting shedule for all investor
        for(uint i = 0; i < investors.length; i++){
            Investor memory _investor = investors[i];
            
              vesting.createVestingSchedule(
                _investor.investor,
                TGETime,
                cliff,
                duration,
                1,
                false,
                _investor.investment,
                true
             );

  
        }

        super._finalization();
    }

    /**
     * @dev Must be called after crowdsale ends, to do some extra finalization
     * work. Calls the contract's finalization function.
     */
    function finalize() override public onlyOwner {
         super.finalize();
    }

    function getCurrentTime()
        internal
        virtual
        view
        returns(uint256){
        return block.timestamp;
    }

    



}