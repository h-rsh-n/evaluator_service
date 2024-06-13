import express from "express";

import { pingCheck } from "../../controllers/pingController";
import submissionRouter from "./submissionRoute";
const v1Router = express.Router();


v1Router.use('/submission',submissionRouter)
v1Router.get('/ping',pingCheck);

export default v1Router;