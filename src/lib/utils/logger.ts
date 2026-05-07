export const logger = {
  info: (stage: string, message: string) => {
    console.log(`[🟢 INFO] [${new Date().toISOString()}] [${stage}] ${message}`);
  },
  warn: (stage: string, message: string) => {
    console.warn(`[🟠 WARN] [${new Date().toISOString()}] [${stage}] ${message}`);
  },
  error: (stage: string, message: string, error?: any) => {
    console.error(`[🔴 ERROR] [${new Date().toISOString()}] [${stage}] ${message}`, error || '');
  }
};
