import codeExecutorStrategy, { executionResponse } from "../types/codeExecutorStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeBufferStream from "./dockerHelper";
import { pullImage } from "./pullImage";

class JavaExecutor implements codeExecutorStrategy{
  async execute(code: string, inputTestCase: string): Promise<executionResponse> {

    const rawBuffer:Buffer[] = [];
    console.log('initialising the java container');
    await pullImage(JAVA_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    const javaDockerContainer = await createContainer(JAVA_IMAGE,[
      '/bin/sh',
      '-c',
      runCommand
    ]);

    //staring the container
    await javaDockerContainer.start();

    console.log('Java docker container started');

    const loggerStream = await javaDockerContainer.logs({
      stdout:true,
      stderr:true,
      timestamps:false,
      follow:true
    });

    //attach events to start and stop reading
    loggerStream.on('data',(chunk)=>{
      rawBuffer.push(chunk);
    })

    try {
      const codeResponse:string = await this.fetchDecodedStream(loggerStream,rawBuffer);
      return {output:codeResponse,status:"COMPLETED"};
    } catch (error) {
      return {output:error as string,status:"ERROR"}
    }finally{
      await javaDockerContainer.remove();
    }
    
  }

  fetchDecodedStream(loggerStream:NodeJS.ReadableStream,rawBuffer:Buffer[]):Promise<string>{
    return new Promise((res,rej)=>{
      loggerStream.on('end',()=>{
        //console.log(rawBuffer);
        const completeBuffer = Buffer.concat(rawBuffer);
        const decodedStream = decodeBufferStream(completeBuffer);
        //console.log('formated output')
        if(decodedStream.stderr){
          rej(decodedStream.stderr);
        }else{
          res(decodedStream.stdout);
        }
      })
    })
  }
}

export default JavaExecutor;