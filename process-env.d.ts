declare {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            LOCAL_PRIVATE_KEY: string;
            ETHERSCAN_API_KEY: string;
            INFURA_API_KEY: string;
        }
    }
}