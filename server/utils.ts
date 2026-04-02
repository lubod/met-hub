/* eslint-disable camelcase */
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.MY_JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("MY_JWT_SECRET environment variable is not set");
}

export function createToken(id: string) {
  const now = Date.now();
  const durationInSec = 60 * 60 * 24 * 7;
  const token = jwt.sign(
    {
      id,
      exp: Math.floor(now / 1000) + durationInSec,
    },
    JWT_SECRET,
  );
  return {
    token,
    createdAt: now,
    expiresAt: now + durationInSec * 1000,
  };
}

export function verifyToken(token: any) {
  if (token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
  return null;
}
