import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeBufferStream from "./dockerHelper";

async function runJava(code:string,inputTestCase:string){
  const rawBuffer:Buffer[] = [];
  console.log('initialising the java container');
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

  await new Promise((res)=>{
    loggerStream.on('end',()=>{
      //console.log(rawBuffer)
      const completeBuffer = Buffer.concat(rawBuffer);
      const decodedStream = decodeBufferStream(completeBuffer);
      //console.log('formated output')
      console.log(decodedStream.stdout)
      res(decodedStream);
    })
  })


  await javaDockerContainer.remove();

  return javaDockerContainer;
}

export default runJava;