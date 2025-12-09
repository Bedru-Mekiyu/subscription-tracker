import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const authorize = async (req, res, next) => {
  try {
    let token;

    // ✔️ SAFELY check authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ✔️ If no token, stop here
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // ✔️ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✔️ Get user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
};

export default authorize;
