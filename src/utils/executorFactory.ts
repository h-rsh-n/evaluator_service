import CppExecutor from "../containers/cppExecutor";
import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/pythonExecutor";
import codeExecutorStrategy from "../types/codeExecutorStrategy";

export default function createExecutor(codeLanguage:string) :codeExecutorStrategy| null{
  if(codeLanguage == "PYTHON"){
    return new PythonExecutor();
  }else if(codeLanguage == "JAVA"){
    return new JavaExecutor();
  }else if(codeLanguage == "CPP"){
    return new CppExecutor();
  }else{
    return null;
  }
}