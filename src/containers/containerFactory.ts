import Docker from "dockerode";

//code helps in craetion of docker image based on language

async function createContainer(imageName:string,cmdExecutable:string[]) {
  const docker = new Docker();

  const container =  await docker.createContainer({
    Image:imageName,
    Cmd:cmdExecutable,
    AttachStdin:true, //to enable input streams
    AttachStdout:true, //to enale output streams
    AttachStderr:true,
    Tty:false,
    OpenStdin:true // input stream alive even when no interaction is present
  });
  return container;
}

export default createContainer;