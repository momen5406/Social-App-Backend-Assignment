import { createClient, RedisClientType } from "redis";
import { ICacheProvider } from "../cache.interface";

interface RedisConfig {
  url: string;
}

export class RedisCacheProvider implements ICacheProvider {
  private client: RedisClientType;
  constructor(config: RedisConfig) {
    this.client = createClient(config);
    this.client
      .connect()
      .then(() => {
        console.log("Redis connected Successfully");
      })
      .catch((err) => {
        console.log("Fail to connect to database.");
      });
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (ttlSeconds) await this.client.set(key, value, { EX: ttlSeconds });
    await this.client.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
