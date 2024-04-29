import jwt from "jsonwebtoken";

class AuthenticationMiddleware {
  async generateToken(_id, tokens) {
    try {
      const token = await jwt.sign(
        { _id: _id.toString() },
        "TaskManagerJwtSecretKey",
        {
          algorithm: "HS256",
          expiresIn: "30d",
        }
      );
      return token;
    } catch (error) {
      throw new Error(error);
    }
  }

  async isAuthenticate(request, response, next) {
    try {
      if (request.headers.token) {
        const verifiedToken = await jwt.verify(
          request.headers.token,
          "TaskManagerJwtSecretKey"
        );
        request.user = { id: verifiedToken._id, verifiedToken };
        return next();
      }
    } catch (error) {
      return response.status(401).send("Token invalid");
    }
    return response.status(401).send("Token not found in request");
  }
}

export { AuthenticationMiddleware };
