import express from "express";
import { config } from "dotenv";
import router from "./routers/index.js";

config();

const app = express();
const port = process.env.RUN_PORT;

app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
