import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import { signToken } from "../helpers/jwt.js";
import { loginSchema, registerSchema } from "../helpers/zod.js";
import { ErrorHandler } from "../middlewares/error_handler.js";
import { getUserEmail, newUSer } from "../models/auth_model.js";

export const userByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await getUserEmail(email);
    res.status(200).json({
      messages: "Ini datanya",
      data: result,
    });
  } catch (error) {
    throw error;
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, role_id } = registerSchema.parse({
      ...req.body,
      role_id: Number(req.body.role_id),
    });

    const existingEmail = await getUserEmail(email);
    // console.log(existingEmail, `<exist email`);

    if (existingEmail) {
      res.status(409).json({ messages: `Email already registered` });
    }
    
    const hashedPassword = await hashPassword(password);
    const result = await newUSer(email, hashedPassword, role_id);
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
      // throw new ErrorHandler(`User Does Not Exist`, 401)
    }
    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({ messages: `wrong password` });
    }

    const token = await signToken({
      id: user.id,
      role: user.role_id,
      isProfileComplete: user.is_profile_complete
    });

    res.status(200).json({
      messages: `Login succesfull complete your profile`,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};
