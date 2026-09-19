import { createClient, type RedisClientType } from 'redis'
import { logger } from '../utils/logger'

class RedisService {
  private client: RedisClientType | null = null
  private isConnected = false
  private triedConnecting = false

  async connect(): Promise<void> {
    if (this.isConnected || this.triedConnecting) return
    this.triedConnecting = true

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: { connectTimeout: 1500, reconnectStrategy: false },
      }) as RedisClientType

      this.client.on('error', () => {
        this.isConnected = false
      })
      this.client.on('connect', () => {
        this.isConnected = true
        logger.info('Redis connected')
      })

      await this.client.connect()
    } catch {
      logger.info('Redis unavailable — using in-memory caching fallback.')
      this.client = null
      this.isConnected = false
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) return null
    try { return await this.client.get(key) } catch { return null }
  }

  async set(key: string, value: string, ttlSeconds = 300): Promise<void> {
    if (!this.client || !this.isConnected) return
    try { await this.client.setEx(key, ttlSeconds, value) } catch { /* silent */ }
  }

  async del(key: string): Promise<void> {
    if (!this.client || !this.isConnected) return
    try { await this.client.del(key) } catch { /* silent */ }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.client || !this.isConnected) return
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) await this.client.del(keys)
    } catch { /* silent */ }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client || !this.isConnected) return false
    try { await this.client.ping(); return true } catch { return false }
  }
}

export const redis = new RedisService()
