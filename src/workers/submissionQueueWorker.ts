import { Job,Worker } from "bullmq";
import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/SubmissionJobs";

export default function submissionWorker(queueName:string){
  new Worker(queueName,async(job:Job)=>{
    console.log('inside worker');
    if(job.name == 'SubmissionJob'){
      console.log('submission job');
      const submissionInstance = new SubmissionJob(job.data);
      submissionInstance.handle(job)
      return true;
    }
  },{
    connection:redisConnection
  })
}