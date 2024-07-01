import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeBufferStream from "./dockerHelper";
import { pullImage } from "./pullImage";

async function runCpp(code:string,inputTestCase:string) {
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

  await new Promise((res)=>{
    loggerStream.on('end',()=>{
      const completeBuffer = Buffer.concat(rawBuffer);
      const decodedStream = decodeBufferStream(completeBuffer);
      console.log(decodedStream.stdout);
      console.log(decodedStream.stderr);
      res(decodedStream);
    })
  })
  
  await cppDockerContainer.remove();

  return cppDockerContainer;
}

export default runCpp;