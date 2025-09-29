import { pool } from "../config/config.js";
import { verifyToken } from "../helpers/jwt.js";
import { getUserId } from "../models/auth_model.js";

export async function authentication(req, res, next) {
  try {
    const header = req.header(`Authorization`);
    if (!header) {
      return res.status(401).json({ messages: `you need to login first` });
    }

    const token = header.split(" ")[1]
    let decoded
    try {
      decoded = await verifyToken(token)
    } catch (error) {
      return res.status(403).json({messages: "invalid or expired token"})
    }


    const userById = await getUserId(decoded.id)
    if (!userById) {
      return res.status(404).json({messages: `users with id ${token.id} does not exist`})
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      isProfileComplete : decoded.isProfileComplete,
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
