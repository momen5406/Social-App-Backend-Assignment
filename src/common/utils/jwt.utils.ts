import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config";

export function generateAccessToken(payload: any) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

export function generateRefreshToken(payload: any) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}
