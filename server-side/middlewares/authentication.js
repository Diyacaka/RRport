import { pool } from "../config/config.js";
import { verifyToken } from "../helpers/jwt.js";

export async function authentication(req, res, next) {
  try {
    const header = req.header(`Authorization`);
    if (!header) {
      return res.status(401).json({ messages: `you need to login first` });
    }

    const token = await verifyToken(header.split(" ")[1]);
    if (!token) {
      return res.status(403).json({ messages: `invalid or expired token` });
    }

    req.user = {
      id: token.id,
      role: token.role,
      isProfileComplete : token.isProfileComplete,
      // tokenVersion : token.tokenVersion
    };
    next();
  } catch (error) {
    next(error);
  }
}

export async function profileCheck (req, res, next) {
  try {
    const userId = req.user.id
    const result = await pool.query(
      `select is_profile_complete from users where id = $1
      `,[userId]
    )

    if (!result.rows.length || !result.rows[0].is_profile_complete) {
      return res.status(403).json({messages: `Please complete your profile first`})
    }

    next()
  } catch (error) {
    throw error
  }
}
