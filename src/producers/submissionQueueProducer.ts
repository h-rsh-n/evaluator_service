import submissionQueue from "../queues/submissionQueue";

export default async function(_name:string,payload:Record<string,unknown>){
  await submissionQueue.add('SubmissionJob',payload);
}