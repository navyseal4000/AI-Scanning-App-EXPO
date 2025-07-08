declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_OPENAI_API_KEY: string;
      EXPO_PUBLIC_APP_NAME: string;
      EXPO_PUBLIC_DEFAULT_PROMPT: string;
    }
  }
}

// Ensure this file is treated as a module
export {};