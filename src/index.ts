import express from "express"
import serverConfig from "./config/serverConfig";

const app = express();

app.listen(serverConfig.PORT,()=>{
  console.log(`server running on port 3000`);
})
