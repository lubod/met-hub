const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

const jwk = JSON.parse(process.env.JWK) || {};
const pem = jwkToPem(jwk.keys[1]);

const CLIENT_ID = process.env.CLIENT_ID || "";
const USERNAME = process.env.USERNAME || "";

const ENV = process.env.ENV || "";

function verifyToken(token: any) {
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

export default verifyToken;
