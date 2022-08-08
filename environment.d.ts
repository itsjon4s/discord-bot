declare global {
  namespace NodeJS {
    interface ProcessEnv {
      token: string;
      enviroment: 'dev' | 'prod' | 'debug';
    }
  }
}

export {};
