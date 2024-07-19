import codeExecutorStrategy, { executionResponse } from "../types/codeExecutorStrategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeBufferStream from "./dockerHelper";
import { pullImage } from "./pullImage";

class CppExecutor implements codeExecutorStrategy{
  async execute(code: string, inputTestCase: string): Promise<executionResponse> {
    const rawBuffer:Buffer[] = [];
    console.log('initialising the cpp conatainer');
    await pullImage(CPP_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
    const cppDockerContainer = await createContainer(CPP_IMAGE,[
      '/bin/sh',
      '-c',
      runCommand
    ]);

    //start the docker container
    await cppDockerContainer.start();

    console.log('Cpp docker container started');

    const loggerStream = await cppDockerContainer.logs({
      stdout:true,
      stderr:true,
      timestamps:false,
      follow:true
    });

    loggerStream.on('data',(chunk)=>{
      rawBuffer.push(chunk);
    })

    try {
      const codeResponse:string = await this.fetchDecodeStream(loggerStream,rawBuffer);
      return {output:codeResponse,status:"COMPLETED"};
    } catch (error) {
      return {output:error as string,status:"ERROR"};
    }finally{
      await cppDockerContainer.remove();
    }
  }

  fetchDecodeStream(loggerStream:NodeJS.ReadableStream,rawBuffer:Buffer[]):Promise<string>{
    return new Promise((res,rej)=>{
      loggerStream.on('end',()=>{
        const completeBuffer = Buffer.concat(rawBuffer);
        const decodedStream = decodeBufferStream(completeBuffer);
        if(decodedStream.stderr){
          rej(decodedStream.stderr);
        }else{
          res(decodedStream.stdout);
        }
      })
    })
  }
} 

export default CppExecutor;