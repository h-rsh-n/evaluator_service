//import Docker from 'dockerode';

//import { TestCases } from '../types/testCases';
import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeBufferStream from './dockerHelper';

async function runPython(code:string,inputTestCase:string){
  const rawBuffer :Buffer[]= [];
  console.log('initialising the python container');
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

  await new Promise((res)=>{
    loggerStream.on('end',()=>{
      //console.log(rawBuffer);
      const completeBuffer = Buffer.concat(rawBuffer);
      const decodedStream = decodeBufferStream(completeBuffer);
      //console.log('formated output')
      console.log(decodedStream.stderr);
      console.log(decodedStream.stdout);
      res(decodedStream)
    })
  })

  //remove the container when done with it
  await pythonDockerContainer.remove();

   
  return pythonDockerContainer;
}

export default runPython;

