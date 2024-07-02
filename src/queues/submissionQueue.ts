import redisConnection from "../config/redisConfig";
import { Queue } from "bullmq";

export default new Queue('submissionQueue',{connection:redisConnection});