import express from "express";
import {
  getGuardianNameHandler,
  getGuardianIDHandler,
  newGuardianHandler,
  updateGuardianHandler,
  newStudentHandler,
  updateStudentHandler,
  getStudentNameHandler,
  getStudentGuardianHandler,
  getStudentProfileHandler,
} from "../controllers/guardian_controller.js";
import { authentication, profileCheck } from "../middlewares/authentication.js";
import { studentUpdateAuth } from "../middlewares/authorization.js";

const guardianRouter = express.Router();

//GUARDIAN SECTION//

guardianRouter.get("/wards", authentication, getStudentGuardianHandler);
guardianRouter.get("/by-id/:id", authentication, getGuardianIDHandler);
guardianRouter.get("/", authentication, getGuardianNameHandler);

guardianRouter.post("/", authentication, newGuardianHandler);

guardianRouter.patch("/update", authentication, updateGuardianHandler);

//STUDENT SECTION//

guardianRouter.get("/student/:id", authentication, getStudentProfileHandler);
guardianRouter.get("/student", authentication, getStudentNameHandler);

guardianRouter.post(
  "/student/:id",
  authentication,
  profileCheck,
  newStudentHandler
);

guardianRouter.patch(
  "/student/:id",
  authentication,
  studentUpdateAuth,
  updateStudentHandler
);

export default guardianRouter;
