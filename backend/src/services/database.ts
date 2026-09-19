import { Pool, type PoolClient } from 'pg'
import { logger } from '../utils/logger'

class Database {
  private pool: Pool | null = null
  private isAvailable: boolean | null = null

  connect(): Pool {
    if (this.pool) return this.pool

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'civicai',
      user: process.env.DB_USER || 'civicai_user',
      password: process.env.DB_PASSWORD || 'civicai_password',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 2000,
    })

    this.pool.on('error', () => {
      this.isAvailable = false
    })

    return this.pool
  }

  async query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number | null }> {
    const pool = this.connect()
    try {
      const result = await pool.query(sql, params)
      return result as { rows: T[]; rowCount: number | null }
    } catch (err) {
      if (this.isAvailable !== false) {
        logger.warn('Database query fallback triggered')
      }
      throw err
    }
  }

  async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const pool = this.connect()
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const result = await fn(client)
      await client.query('COMMIT')
      return result
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const pool = this.connect()
      const client = await pool.connect()
      await client.query('SELECT 1')
      client.release()
      this.isAvailable = true
      return true
    } catch {
      this.isAvailable = false
      return false
    }
  }

  async end(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
  }
}

export const db = new Database()
