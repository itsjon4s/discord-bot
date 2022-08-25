declare global {
  namespace NodeJS {
    interface ProcessEnv {
      enviroment: 'prod' | 'dev';
      TOKEN: string;
      DATABASE_URL: string;
    }
  }
}

export {}