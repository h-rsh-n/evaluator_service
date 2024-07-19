import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDesc";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/executorFactory";
import { executionResponse } from "../types/codeExecutorStrategy";
//import runCpp from "../containers/cppExecutor";

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
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].userCode;
      const inputTestCases = this.payload[key].inputCase;
      const strategy = createExecutor(codeLanguage);
      if(strategy!=null){
        const response:executionResponse = await strategy.execute(code,inputTestCases);
        if(response.status == "COMPLETED"){
          console.log("code executed successfully");
          console.log(response);
        }else{
          console.log("Something went wrong with code execution");
          console.log(response)
        }
      }
    }
  }

  failed = (job?:Job):void=>{
    console.log("job failed",job?.id);
  }
}


