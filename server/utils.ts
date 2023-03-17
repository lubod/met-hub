const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

const jwkCognito = JSON.parse(process.env.JWK) || {};
const pem = jwkToPem(jwkCognito.keys[1]);

const CLIENT_ID = process.env.CLIENT_ID || "";
const USERNAME = process.env.USERNAME || "";

const ENV = process.env.ENV || "";

export function createToken(id: string) {
  const now = Date.now();
  const durationInSec = 60 * 60 * 24 * 7;
  const token = jwt.sign(
    { id, exp: Math.floor(now / 1000) + durationInSec },
    process.env.MY_JWT_SECRET
  );

  return {
    token,
    duration: durationInSec * 1000,
    expiresAt: now + durationInSec * 1000,
  }; // todo
}

export function verifyCognitoToken(token: any) {
  if (ENV === "dev") {
    return {
      username: "test",
    };
  }
  if (token) {
    try {
      const decodedToken = jwt.verify(token, pem, { algorithms: ["RS256"] });
      if (decodedToken.client_id !== CLIENT_ID) {
        console.error("client_id");
        return null;
      }
      if (decodedToken.username !== USERNAME) {
        console.error("username");
        //                return false;
      }
      console.info(decodedToken);
      return decodedToken.username;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return null;
}

export function verifyToken(token: any) {
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.MY_JWT_SECRET);
      console.info(decodedToken);
      return decodedToken.id;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return null;
}
