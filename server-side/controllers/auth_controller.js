import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { decodeToken, generateAccessToken, generateRefreshToken, verifyToken } from "../helpers/jwt.js";
import { loginSchema, registerSchema } from "../helpers/zod.js";
import { ErrorHandler } from "../middlewares/error_handler.js";
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

export const userByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await getUserEmail(email);
    res.status(200).json({
      messages: "here you go",
      data: result,
    });
  } catch (error) {
    throw error;
  }
};

export const register = async (req, res, next) => {
  try {
    const ACCESS = process.env.ACCESS;
    const {email, password, role_id} = registerSchema.parse(req.body)
    // const { email, password, role_id } = registerSchema.parse({
    //   ...req.body,
    //   role_id: Number(req.body.role_id),
    // });
    // let parsedRole = parseInt(req.body.role_id, 10);
    // if (isNaN(parsedRole)) {
    //   parsedRole = 3; // default
    // }
    // if (role_id === 2) {
    //   res.status(409).json({message: `Cannot `})
    // }
    let trueRoleId = role_id;

    const existingEmail = await getUserEmail(email);
    // console.log(existingEmail, `<exist email`);

    if (existingEmail) {
      return res.status(409).json({ messages: `Email already registered` });
    }


    if (email.toLowerCase().includes(ACCESS)) {
      trueRoleId = 2;
    }

    if (trueRoleId === 1) {
      return res.status(403).json({ message: `Cannot pick this role` });
    }

    if (trueRoleId === 2 && !email.toLowerCase().includes(ACCESS)) {
      return res.status(403).json({ message: `Forbidden register format` });
    }

    const hashedPassword = await hashPassword(password);

    const result = await newUSer(email, hashedPassword, trueRoleId);
    res.status(201).json({
      message: "Reistrasi sukses",
      uID: result.id,
    });
  } catch (error) {
    if (error.code === `23505`) {
      return res.json({ messages: `Email already registered` });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await getUserEmail(email);
    if (!user) {
      return res.status(404).json({ messages: `user does not exist` });
    }

    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({ messages: `wrong password` });
    }

    const accessToken = await generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)

    // const { accessToken, refreshToken } = generateTokens(user);

    const decode = await decodeToken(refreshToken);

    await saveRefreshToken(user.id, refreshToken, new Date(decode.exp * 1000));

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // const token = await signToken({
    //   id: user.id,
    //   role: user.role_id,
    //   isProfileComplete: user.is_profile_complete,
    //   // tokenVersion : user.token_version
    // });

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
      return res.status(401).json({ messages: `refresh token not found` });
    }

    const storedRefreshToken = await getRefreshToken(refreshToken);
    if (!storedRefreshToken) {
      return res.status(401).json({ messages: `invalid or expired token` });
    }

    const decoded = await decodeToken(refreshToken);

    const user = await getUserId(decoded.id)

    const accessToken = await generateAccessToken(user)
    res.status(200).json({ accessToken });
  } catch (error) {
    throw error;
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(400).json({messages: `No refresh token was not found`})
    }

    await revokeRefreshToken(refreshToken)

    res.clearCookie("refreshToken",{
      httpOnly:true,
      secure: NODE_ENV === "production",
      sameSite: "strict"
    })

    res.status(200).json({messages: `Logout Success`})
  } catch (error) {
    throw error
  }
}