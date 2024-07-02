import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDesc";
import { SubmissionPayload } from "../types/submissionPayload";
import runCpp from "../containers/runCppDocker";

export default class SubmissionJob implements IJob{
  name:string;
  payload: Record<string, SubmissionPayload>;

  constructor(payload:Record<string,SubmissionPayload>){
    this.payload = payload,
    this.name = this.constructor.name
  }

  handle = async(job?:Job)=>{
    console.log("handler of submission called");
    console.log(this.payload)
    if(job){
      const key = Object.keys(this.payload)[0];
      console.log(this.payload[key].language);
      if(this.payload[key].language === "CPP"){
        const response = await runCpp(this.payload[key].userCode,this.payload[key].inputCase)
        console.log(response);
      } 

    }
  }

  failed = (job?:Job):void=>{
    console.log("job failed",job?.id);
  }
}


