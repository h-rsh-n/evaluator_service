import { Request,Response } from "express"
export const pingCheck = (_req:Request,res:Response)=>{
  return res.status(200).json({
    message:"ping check"
  })
}