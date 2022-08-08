declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token: string;
            env: "dev" | "prod" | "debug";
        }
    }
}

export {};
