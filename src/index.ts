import express from "express"

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
//import sampleQueueProcuder from "./producers/sampleQueueProcuder";
//import sampleWorker from "./workers/sampleQueueWorker";
import serverAdapter from "./config/bullBoardConfig";
import bodyParser from "body-parser";
import runPython from "./containers/runPythonDocker";
import runJava from "./containers/runJavaDocker";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use('/api',apiRouter);
app.use('/ui',serverAdapter.getRouter());

app.listen(serverConfig.PORT,()=>{
  console.log(`server running on port ${serverConfig.PORT}`);
  console.log(`BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`);

  // sampleWorker('SampleQueue');

  // sampleQueueProcuder('SampleJob',{
  //   name:"Harshan",
  //   company:"MS",
  //   location:"Bengaluru"
  // });


  const code = `
  import java.util.*;
  public class Main{
    public static void main(String[] args){
      Scanner scn = new Scanner(System.in);
      int input = scn.nextInt();
      System.out.println("input value given by user: "+input);
      for(int i=0;i<input;i++){
        System.out.println(i);
      }
    }
  }
  `; 
  const inputCode1 = `20`;
  const code1 = `inputCode1 = input() 
print(inputCode1)`;
  const inputCode= `10`;
  runJava(code,inputCode);
  runPython(code1,inputCode1);
})






