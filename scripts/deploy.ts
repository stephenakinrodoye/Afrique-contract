import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { AfriqueProfile } from "../typechain";

//Deploying contracts with the account: 0xB52474353F87345a32d0068dEA25fD31280B6Cbc
//AfriqueProfile deployed to: 0x82B18061F0b722808cCF63D24786730f8C69be6c
//Contract deployed and verified!

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
