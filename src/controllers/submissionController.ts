import { Request,Response } from "express";

import { createSubmissionDto } from "../dtos/createSubmissionDto";

export default function addSubmission(req:Request,res:Response){
  const submissionDto = req.body as createSubmissionDto;
  //based on the language of the code should create a docker container
   

  return res.status(201).json({
    success:true,
    error:{},
    message:"Successfully created the submission",
    data:submissionDto
  })
}