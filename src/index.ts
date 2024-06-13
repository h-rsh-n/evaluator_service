import express from "express"

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProcuder from "./producers/sampleQueueProcuder";
import sampleWorker from "./workers/sampleQueueWorker";

const app = express();


app.use('/api',apiRouter)

app.listen(serverConfig.PORT,()=>{
  console.log(`server running on port 3000`);

  sampleWorker('SampleQueue');

  sampleQueueProcuder('SampleJob',{
    name:"Harshan",
    company:"MicroSoft",
    location:"Bengaluru"
  });
})


