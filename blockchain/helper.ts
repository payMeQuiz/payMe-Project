import { network, ethers } from "hardhat"

export const moveBlocks = async (nums: number) => {
    for(let i = 0; i < nums; i++){
       network.provider.request({
           method: "evm_mine",
           params: []
       })
    }

    console.log(`${nums} block moved`);
}

export const moveTime = async(secs: number) =>{
   await network.provider.send("evm_incresedTime", [secs])
   console.log(`Time moved by ${secs} seconds`)
}

export const currentTime = async() =>{
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    console.log(`Current time is: ${timestampBefore}`)
    return timestampBefore;
 }

