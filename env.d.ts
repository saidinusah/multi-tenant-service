namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;

    ARKESEL_KEY: string;

    ARKESEL_URL: string;

    SMS_SENDER_ID: string;

    PORT: number;

    REDIS_PORT: number;

    REDIS_HOST: string;

    JWT_SECRET: string;
  }
}
