import { Job, Worker } from "bullmq";
import redisConnection from "../config/redisConfig";
import SampleJob from "../jobs/SampleJob";

export default function sampleWorker(queueName:string){
  //console.log('Setup redis connection')
  //console.log('queue name',queueName)
  new Worker(queueName,async (job:Job)=>{
    //console.log(job.name)
    if(job.name == 'SampleJob'){
      const sampleJobInstance = new SampleJob(job.data);
      sampleJobInstance.handle(job)
      return true
    }
  },
  {
    connection:redisConnection
  })
}