declare {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            LOCAL_PRIVATE_KEY_ONE: string;
            LOCAL_PRIVATE_KEY_TWO: string;
            ETHERSCAN_API_KEY: string;
            INFURA_API_KEY: string;
        }
    }
}