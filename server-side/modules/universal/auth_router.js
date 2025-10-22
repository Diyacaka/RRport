import express from "express";
import {
  login,
  logout,
  refresh,
  register,
  userByEmail,
} from "./auth_controller.js";
// import {
//   login,
//   logout,
//   refresh,
//   register,
//   userByEmail,
// } from "../controllers/auth_controller.js";
// login,logout,refresh,register,userByEmail

const auth_router = express.Router();

auth_router.get("/email", userByEmail);

auth_router.post("/registration", register);
auth_router.post("/login", login);
auth_router.post("/refresh", refresh);
auth_router.post("/logout", logout);

export default auth_router;
