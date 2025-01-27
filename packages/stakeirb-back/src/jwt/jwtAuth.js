import jwt from "jsonwebtoken";
import "dotenv/config";

export const jwtMiddleware = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get the token from the header
  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Add the user to the request
    req.user = decoded.user;
    next();
  });
};
