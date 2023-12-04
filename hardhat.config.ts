import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "dotenv/config";
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import "@nomiclabs/hardhat-ethers";


const { INFURA_API_KEY, ETHERSCAN_API_KEY, LOCAL_PRIVATE_KEY } = process.env;

const networks: Record<string, NetworkUserConfig> = {
    sepolia: {
        url: INFURA_API_KEY,
        accounts: [LOCAL_PRIVATE_KEY],
    },
};

const config: HardhatUserConfig = {
    defaultNetwork: "sepolia",
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks,
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
};

export default config;





