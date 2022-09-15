import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { ethers } from "hardhat"
import {
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
    TGETIME
} from "../helper-config"

const crowdsaleArgs = require("../arguments/crowdsale");


const deployToken: DeployFunction = async(hre: HardhatRuntimeEnvironment ) => {
   const {deployments, getNamedAccounts, network} = hre
   const {deployer} = await getNamedAccounts()
   const {deploy, log, get} = deployments

   const token = await get(TOKEN_CONTRACT_NAME) 
   //const token_vesting = await get(TOKEN_VESTING_CONTRACT_NAME)

 
   log("Deploying Crowdsale Contract!")

//    address _vestingAddress,
//    uint256 rate,    // rate in PayME
//    address payable wallet,
//    IERC20 _token,
//    uint256 _cap,
//    uint256 _openingTime,
//    uint256 _closingTime

   const crowdsale = await deploy(CROWDSALE_CONTRACT_NAME,{
       from: deployer,
       args: crowdsaleArgs,
       log: true,
    // waitConfirmations: 3   /* Use in production dApp */
   })


   log(`03 - Deployed Token at ${crowdsale.address}`);

}

export default deployToken

deployToken.tags = ["all","crowdsales"]
