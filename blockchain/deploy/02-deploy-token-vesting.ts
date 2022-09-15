import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { ethers, upgrades } from "hardhat"
import {
    TOKEN_CONTRACT_NAME, 
    TOKEN_VESTING_CONTRACT_NAME,
    TGEPERCENTAGE,
    TGETIME
} from "../helper-config"

const deployTokenVesting: DeployFunction = async(hre: HardhatRuntimeEnvironment ) => {
   const {deployments, getNamedAccounts, network} = hre
   const {deployer} = await getNamedAccounts()
   const {deploy, log, get} = deployments

   const token = await get(TOKEN_CONTRACT_NAME)

   log("Deploying Token Vesting Contract!")
//    const token_vesting = await deploy(TOKEN_VESTING_CONTRACT_NAME,{
//        from: deployer,
//        args:[token.address, TGEPERCENTAGE,TGETIME],
//        log: true,
//     // waitConfirmations: 3   /* Use in production dApp */
//    })

   const VestingContract = await ethers.getContractFactory(TOKEN_VESTING_CONTRACT_NAME);

   const token_vesting = await upgrades.deployProxy(
       VestingContract,
       [token.address, TGEPERCENTAGE,TGETIME],
       {initializer: "initialize"}
    );

   await token_vesting.deployed();

   log(`02 - Deployed Token Vesting Contract at ${token_vesting.address}`);

}

export default deployTokenVesting

deployTokenVesting.tags = ["all","token_vesting"]
