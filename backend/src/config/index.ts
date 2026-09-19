import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.BACKEND_PORT) || 3001,
  host: process.env.BACKEND_HOST || '0.0.0.0',
  appName: process.env.APP_NAME || 'CivicAI',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'civicai-super-secret-jwt-key-development',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'civicai-super-refresh-secret-key-development',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000,http://localhost:80').split(','),
  },

  uploads: {
    dir: process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'),
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 15,
  },

  demoMode: process.env.DEMO_MODE !== 'false',
  seedDemoData: process.env.SEED_DEMO_DATA !== 'false',
  
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gemini-1.5-flash',
  },
}
