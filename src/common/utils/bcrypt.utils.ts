import * as bcrypt from "bcrypt";

/**
 * @param password Plaintext password
 * @returns Hashed Value
 */
export function hash(password: string) {
  return bcrypt.hash(password, 10);
}

/**
 * @param password which comes from FE | user
 * @param hashedPassword which comes from DB
 */
export async function compare(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
