export interface ICacheProvider {
  get(key: string): Promise<string | null>;

  set(key: string, value: string, ttlSeconds: number): Promise<void>;

  delete(key: string): Promise<void>;

  addToSet(key: string, value: string): Promise<void>;

  rmSet(key: string, value: string): Promise<boolean>;

  getAllFromSet(Key: string): Promise<string[]>;
}
