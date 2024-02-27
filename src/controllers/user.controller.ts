import { Request, Response } from "express";
import { User } from "../models/user.model";
const createUser=async (req:Request,res:Response)=>{
   const {firstName,lastName,email,phoneNo,password}=req.body;
   const list=await User.find({email});
   if(list.length==0)
   {
       const created= await User.create({firstName,lastName,email,phoneNo,password});
       res.send({message:"User created",data:created,success:true});
   }
   else
   {
    res.send({message:"User already exists.",success:false})
   }
}


const authenticateUser=async (req:Request,res:Response)=>{
    
    res.send({message:"user authenticated"});
}


const deleteUser=async (req:Request,res:Response)=>{
    const id=req.params.id;
    res.send({message:"User with "+id+" deleted"});
}

const updateUser=async (req:Request,res:Response)=>{
    const id=req.params.id;
    res.send({message:"User Updated "+id});
}

export {createUser,deleteUser,authenticateUser,updateUser};