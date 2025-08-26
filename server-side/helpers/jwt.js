import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const secret = process.env.SECRET_KEY;

export async function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role_id,
      isProfileComplete: user.is_profile_complete,
    },
    secret,
    { expiresIn: `10m` }
  );
}

export async function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, secret, { expiresIn: `7d` });
}

export async function decodeToken(token) {
  return jwt.decode(token)
}

export async function verifyToken(token) {
  return jwt.verify(token, secret);
}

// export async function generateAccessToken(user) {

// }

// e

