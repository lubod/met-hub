/* eslint-disable camelcase */
const jwt = require("jsonwebtoken");

export function createToken(id: string) {
  const now = Date.now();
  const durationInSec = 60 * 60 * 24 * 7;
  const token = jwt.sign(
    {
      id,
      exp: Math.floor(now / 1000) + durationInSec,
    },
    process.env.MY_JWT_SECRET
  );

  return {
    token,
    createdAt: now * 1000,
    expiresAt: now + durationInSec * 1000,
  }; // todo
}

export function verifyToken(token: any) {
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.MY_JWT_SECRET);
      console.info(decodedToken);
      return decodedToken;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return null;
}
