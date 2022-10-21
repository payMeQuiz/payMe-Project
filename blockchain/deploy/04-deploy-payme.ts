import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { ethers, upgrades } from "hardhat"
import {
    TOKEN_CONTRACT_NAME
} from "../helper-config"

const deployPayme: DeployFunction = async(hre: HardhatRuntimeEnvironment ) => {
   const {deployments, getNamedAccounts, network} = hre
   const {deployer} = await getNamedAccounts()
   const {deploy, log, get} = deployments

   const token = await get(TOKEN_CONTRACT_NAME)

   log("Deploying Payme Contract!")
//    const token_vesting = await deploy(TOKEN_VESTING_CONTRACT_NAME,{
//        from: deployer,
//        args:[token.address, TGEPERCENTAGE,TGETIME],
//        log: true,
//     // waitConfirmations: 3   /* Use in production dApp */
//    })

   const PaymeContract = await ethers.getContractFactory("Payme");

   const payme_contract = await upgrades.deployProxy(
       PaymeContract,
       [token.address],
       {initializer: "initialize"}
    );

   await payme_contract.deployed();

   console.log(`04 - Deployed Payme Contract at ${payme_contract.address}`);

}

export default deployPayme

deployPayme.tags = ["all","payme"]
