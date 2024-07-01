import express from "express"

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
//import sampleQueueProcuder from "./producers/sampleQueueProcuder";
//import sampleWorker from "./workers/sampleQueueWorker";
import serverAdapter from "./config/bullBoardConfig";
import bodyParser from "body-parser";
//import runPython from "./containers/runPythonDocker";
//import runJava from "./containers/runJavaDocker";
import runCpp from "./containers/runCppDocker";

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

  const inputCode= `10`;
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

const userCode = `
    class Solution {
      public:
      vector<int> permute() {
          vector<int> v;
          v.push_back(10);
          return v;
      }
    };
  `;

  const code2 = `
  #include<iostream>
  #include<vector>
  #include<stdio.h>
  using namespace std;
  
  ${userCode}

  int main() {

    Solution s;
    vector<int> result = s.permute();
    for(int x : result) {
      cout<<x<<" ";
    }
    cout<<endl;
    return 0;
  }
  `;

  const inputCode2 = `10`;
  
  //runJava(code,inputCode);
  //runPython(code1,inputCode1);
  runCpp(code2,inputCode2)
})






