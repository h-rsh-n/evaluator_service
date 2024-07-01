import DockerStreamOutput from "../types/dockerStreamOutput";
import { HEADER_SIZE } from "../utils/constants";


export default function decodeBufferStream(buffer:Buffer):DockerStreamOutput{
  //console.log('inside helper')
  let offset:number = 0; //keeps track of the current pos in the buffer while parsing

  //the output that will store the accumulated stdout and stderr as strings
  const output:DockerStreamOutput={stdout:'',stderr:''};

  while(offset<buffer.length){
    
    //the values represent the type of stream
    const typeOfStream = buffer[offset];

    //signifies the length of the value 
    const length = buffer.readUint32BE(offset+4);

    //header has been processed move the offset pass the header
    offset+=HEADER_SIZE;

    if(typeOfStream === 1){
      //stdout stream
      output.stdout += buffer.toString('utf-8',offset,offset+length);
    }else if(typeOfStream === 2){
      output.stderr += buffer.toString('utf-8',offset,offset+length);
    }

    offset+=length;
  }
  return output
}