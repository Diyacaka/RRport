import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  Unauthorized,
} from "../helpers/enhanchedError.js";
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../helpers/jwt.js";
import { loginSchema, registerSchema } from "../helpers/zod.js";
// import { ErrorHandler } from "../middlewares/error_handler.js";
import {
  getRefreshToken,
  getUserEmail,
  getUserId,
  newUSer,
  revokeRefreshToken,
  saveRefreshToken,
} from "../models/auth_model.js";
import { config } from "dotenv";
config();

const NODE_ENV = process.env.NODE_ENV;

export const userByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await getUserEmail(email);
    res.status(200).json({
      messages: "here you go",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const ACCESS = process.env.ACCESS;
    const { email, password, role_id } = registerSchema.parse(req.body);

    let trueRoleId = role_id;

    const existingEmail = await getUserEmail(email);

    if (existingEmail) {
      throw new ConflictError(`Email already registered`);
    }

    if (email.toLowerCase().includes(ACCESS)) {
      trueRoleId = 2;
    }

    if (trueRoleId === 1) {
      throw new ForbiddenError(`Forbidden format, Cannot pick this role`);
    }

    if (trueRoleId === 2 && !email.toLowerCase().includes(ACCESS)) {
      throw new ForbiddenError(`Forbidden format registration, try again`);
    }

    const hashedPassword = await hashPassword(password);

    const result = await newUSer(email, hashedPassword, trueRoleId);
    res.status(201).json({
      message: "Reistrasi Success",
      uID: result.id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await getUserEmail(email);
    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`);
    }

    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
      throw new Unauthorized(`Wrong Credential(Password)`);
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);


    const decode = await decodeToken(refreshToken);

    await saveRefreshToken(user.id, refreshToken, new Date(decode.exp * 1000));

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      messages: `Login succesfull complete your profile`,
      data: { accessToken, user: { profileStatus: user.is_profile_complete } },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Unauthorized(`Refresh Token not found, try login again`);
    }

    const storedRefreshToken = await getRefreshToken(refreshToken);
    if (!storedRefreshToken) {
      throw new Unauthorized(`Token might expired or invalid`);
    }

    const decoded = await decodeToken(refreshToken);

    const user = await getUserId(decoded.id);

    const accessToken = await generateAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (error) {
    next();
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Unauthorized(`No Refresh_Token was found`);
    }

    await revokeRefreshToken(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ messages: `Logout Success` });
  } catch (error) {
    next();
  }
};
