import express from "express";
import {
  getGuardianNameHandler,
  getGuardianIDHandler,
  newGuardianHandler,
  updateGuardianHandler,
  newStudentHandler,
  updateStudentHandler,
  getStudentNameHandler,
  // getStudentGuardianHandler,
  getStudentProfileHandler,
  getAllStudentHandler,
} from "../controllers/guardian_controller.js";
import { authentication, profileCheck } from "../middlewares/authentication.js";
import { studentUpdateAuth, userAuthorization } from "../middlewares/authorization.js";
import { getAllGuardian } from "../models/guardian_model.js";

const guardianRouter = express.Router();

//GUARDIAN SECTION//

// guardianRouter.get("/wards", authentication, getStudentGuardianHandler);
guardianRouter.get("/by-id/:id", authentication, getGuardianIDHandler);
guardianRouter.get("/guardian_name", authentication, getGuardianNameHandler);

guardianRouter.post("/post_guardian", authentication, newGuardianHandler);

guardianRouter.patch("/update/:id", authentication, userAuthorization, updateGuardianHandler);

guardianRouter.get("/all_guardians", authentication, getAllGuardian)

//STUDENT SECTION//
guardianRouter.get("/all_students", getAllStudentHandler);

guardianRouter.get("/student/:id", authentication, getStudentProfileHandler);

guardianRouter.get("/student/name/:id", authentication, getStudentNameHandler);

guardianRouter.post(
  "/student/post_student/:guardian_id",
  authentication,
  profileCheck,
  newStudentHandler
);

guardianRouter.patch(
  "/student/:guardian_id/:student_id",
  authentication,
  studentUpdateAuth,
  updateStudentHandler
);

export default guardianRouter;
