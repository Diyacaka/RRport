import express from "express";
import {
  authentication,
  profileCheck,
} from "../../middlewares/authentication.js";
import { authorizedRole, studentUpdateAuth } from "../../middlewares/authorization.js";
import upload from "../../helpers/cloudinary.js";
import {
  findListedStudent,
  getStudentByIdHandler,
  newStudentHandler,
  updateStudentHandler,
} from "./student_controller.js";

const studentRouter = express.Router();

studentRouter.get("/", authentication, findListedStudent);

studentRouter.get("/:id", authentication, getStudentByIdHandler);

studentRouter.post(
  "/",
  authentication,
  upload.single("photo"),
  profileCheck,
  newStudentHandler
);

studentRouter.patch(
  "/student/:student_id/guardian/:guardian_id",
  authentication,
  upload.single("photo"),
  studentUpdateAuth,
  updateStudentHandler
);

export default studentRouter;
