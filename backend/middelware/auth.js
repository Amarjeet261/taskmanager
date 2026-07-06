import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'task_manager';

export default async function authMiddleware(req, res, next) {
  try {
    // Grab token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Token Missing"
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (err) {
    console.log("JWT verification failed", err);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired"
    });
  }
}