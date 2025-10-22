import express from "express";
import {
  findListedTeacher,
  getTeacherByid,
  newTeacherHandler,
  updateTeacherHandler,
} from "./teacher_controller.js";
import { authentication } from "../../middlewares/authentication.js";
import upload from "../../helpers/cloudinary.js";
import { userAuthorization } from "../../middlewares/authorization.js";

const teacherRouter = express.Router();

teacherRouter.get("/:id", authentication, getTeacherByid);
teacherRouter.get("/", authentication, findListedTeacher);

teacherRouter.post(
  "/",
  authentication,
  upload.single("photo"),
  newTeacherHandler
);

teacherRouter.patch(
  `/:id`,
  authentication,
  upload.single("photo"),
  userAuthorization,
  updateTeacherHandler
);

export default teacherRouter;
