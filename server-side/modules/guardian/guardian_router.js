import express from "express";
import upload from "../../helpers/cloudinary.js";
import {
  findListedGuardian,
  getGuardianHandler,
  newGuardianHandler,
  updateGuardianHandler,
} from "./guardian_controller.js";
import { authentication } from "../../middlewares/authentication.js";
import { userAuthorization } from "../../middlewares/authorization.js";

const guardianRouter = express.Router();

guardianRouter.get("/:id", authentication, getGuardianHandler);
guardianRouter.get("/", authentication, findListedGuardian);

guardianRouter.post(
  "/",
  authentication,
  upload.single("photo"),
  newGuardianHandler
);

guardianRouter.patch(
  "/:id",
  authentication,
  upload.single("photo"),
  userAuthorization,
  updateGuardianHandler
);

export default guardianRouter;
