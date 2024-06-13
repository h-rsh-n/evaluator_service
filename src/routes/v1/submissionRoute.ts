import express from "express";
import addSubmission from "../../controllers/submissionController";
import { validate } from "../../validators/submissionValidator";
import { createSubmissionZodSchema } from "../../dtos/createSubmissionDto";

const submissionRouter = express.Router();

submissionRouter.post('/',validate(createSubmissionZodSchema),addSubmission)

export default submissionRouter;