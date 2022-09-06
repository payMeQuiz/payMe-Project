import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import { ethers } from "hardhat"
import {TOKEN_CONTRACT_NAME} from "../helper-config"

const deployToken: DeployFunction = async(hre: HardhatRuntimeEnvironment ) => {
   const {deployments, getNamedAccounts, network} = hre
   const {deployer} = await getNamedAccounts()
   const {deploy, log} = deployments

   log("Deploying Token!")
   const token = await deploy(TOKEN_CONTRACT_NAME,{
       from: deployer,
       args:[],
       log: true,
    // waitConfirmations: 3   /* Use in production dApp */
   })

   log(`01 - Deployed Token at ${token.address}`);

}

export default deployToken

deployToken.tags = ["all","token"]
