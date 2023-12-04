import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { AfriqueProfile } from "../typechain";

// deployed to: 0x98DcA60f1e468CF09De87c27Cc80568512A5B210 (infura)
// deployed to: 0x3A689034043Af019c89D244D0979f706Ef73304B (alchemy)
// AfriqueProfile deployed to: 0xed47Ff0C5A5fcbD8c0cD2213ADc04aBc5B43Eb9C

//0xD99DdC90Aaf99D9d48C3b46553b1A3ccF4C4EF7C
 const main = async () => {
    //const hre: HardhatRuntimeEnvironment = await ethers.getHRE();
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy AfriqueProfile
    const AfriqueProfileFactory = await ethers.getContractFactory("AfriqueProfile");
    const afriqueProfile: AfriqueProfile = await AfriqueProfileFactory.deploy(deployer.address);

    await afriqueProfile.deployed();

    console.log("AfriqueProfile deployed to:", afriqueProfile.address);

    console.log("Contract deployed and verified!");
}

// Run the deployment script
const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runMain()
