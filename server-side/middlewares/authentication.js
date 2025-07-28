import { verifyToken } from "../helpers/jwt";

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
      role: token.role_id,
    };
    next();
  } catch (error) {
    next(error);
  }
}
