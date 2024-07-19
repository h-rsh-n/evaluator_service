//import Docker from 'dockerode';

//import { TestCases } from '../types/testCases';
import codeExecutorStrategy, { executionResponse } from '../types/codeExecutorStrategy';
import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeBufferStream from './dockerHelper';
import { pullImage } from './pullImage';


class PythonExecutor implements codeExecutorStrategy{
  async execute(code: string, inputTestCase: string): Promise<executionResponse> {

    const rawBuffer :Buffer[]= [];
    console.log('initialising the python container');
    await pullImage(PYTHON_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE,[
      '/bin/sh',
      '-c',
      runCommand
    ]);
  
    //starting the docker container;
    await pythonDockerContainer.start();
  
    console.log('Python docker container started');
  
    const loggerStream = await pythonDockerContainer.logs({
      stdout:true,
      stderr:true,
      timestamps:false,
      follow:true
    });
  
    //Attack events of loggerStream to start and stop reading
    loggerStream.on('data',(chunk)=>{
      rawBuffer.push(chunk);
    })
  
    try {
      const codeResponse:string=await this.fetchDecodedStream(loggerStream,rawBuffer);
      return {output:codeResponse,status:"COMPLETED"};
    } catch (error) {
      return {output:error as string,status:"ERROR"};
    }finally{
      await pythonDockerContainer.remove();
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

export default PythonExecutor;

