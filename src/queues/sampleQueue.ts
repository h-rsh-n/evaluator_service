import { Queue } from "bullmq";
import redisConnection from "../config/redisConfig";

//console.log("Queue Created")
export default new Queue("SampleQueue",{connection:redisConnection});
