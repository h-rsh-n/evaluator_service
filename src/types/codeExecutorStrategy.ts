export default interface codeExecutorStrategy{
  execute(code:string,inputTestCase:string):Promise<executionResponse>;
};


export type executionResponse = {output:string,status:string};