import Redis from "ioredis";
import serverConfig from "./serverConfig";

const redisConfig = {
  port:serverConfig.REDIS_PORT,
  host:serverConfig.REDIS_HOST
}

const redisConnection = new Redis(redisConfig);

export default redisConnection;

