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
        console.log(err);

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

  /**
   * @param key >> ex: "userId.FCM"
   * @param token fcm from token firebase
   */
  async addToSet(key: string, value: string): Promise<void> {
    await this.client.sAdd(key, value);
  }

  async rmSet(key: string, value: string): Promise<boolean> {
    const number = await this.client.sRem(key, value);
    return number ? true : false;
  }

  async getAllFromSet(Key: string): Promise<string[]> {
    return await this.client.sMembers(Key);
  }
}
