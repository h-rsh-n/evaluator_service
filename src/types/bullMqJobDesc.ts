import { Job } from "bullmq";
//import { SubmissionPayload } from "./submissionPayload";

export interface IJob{
  name:string
  payload?:Record<string,unknown>
  handle:(job?:Job)=> void
  failed:(job?:Job)=> void
}

