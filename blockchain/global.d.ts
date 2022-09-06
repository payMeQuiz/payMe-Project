declare global {
    namespace NodeJS {
      interface ProcessEnv {
        URL: string;
        PRIVATE_KEY: string;
        
      }
    }
  }
  export {};