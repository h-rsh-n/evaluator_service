import express from "express"

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProcuder from "./producers/sampleQueueProcuder";
import sampleWorker from "./workers/sampleQueueWorker";
import serverAdapter from "./config/bullBoardConfig";

const app = express();


app.use('/api',apiRouter);
app.use('/ui',serverAdapter.getRouter());

app.listen(serverConfig.PORT,()=>{
  console.log(`server running on port ${serverConfig.PORT}`);
  console.log(`BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`);

  sampleWorker('SampleQueue');

  sampleQueueProcuder('SampleJob',{
    name:"Harshan",
    company:"MicroSoft",
    location:"Bengaluru"
  });

  sampleQueueProcuder('SampleJob',{
    name:"Pragya Das",
    company:"GoldmanSachs",
    location:"Hyderabad"
  })
})


