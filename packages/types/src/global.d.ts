declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      AUTH_SECRET: string;
      AUTH_URL: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      RESEND_API_KEY: string;
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
      ADMIN_EMAIL?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
