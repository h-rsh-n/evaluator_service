import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDesc";

export default class SampleJob implements IJob{
  name:string;
  payload: Record<string, unknown>;

  constructor(payload:Record<string,unknown>){
    //console.log("inside constructor")
    this.payload = payload,
    this.name = this.constructor.name
  }

  handle = (job?:Job):void=>{
    console.log("handler of the job called")
    //console.log(this.payload)
    if(job){
      console.log(job.id,job.data)
    }
  }

  failed = (job?:Job):void=>{
    console.log("job failed",job?.id)
  }
}