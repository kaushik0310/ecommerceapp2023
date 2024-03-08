
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js"; 
import JWT from "jsonwebtoken";

export const registerController = async(req,res)=>{
    try {
        const{name,email,password,phone,address}=req.body;
        //validations
        if(!name){
            return resizeBy.send({error:'Name is Required'})
        }
        if(!email){
            return resizeBy.send({error:'Email is Required'})
        }
        if(!password){
            return resizeBy.send({error:'Password is Required'})
        }
        if(!phone){
            return resizeBy.send({error:'Phone is Required'})
        }
        if(!address){
            return resizeBy.send({error:'Address is Required'})
        }
//check user
const existingUser = await userModel.findOne({email})
//existing user
if(existingUser){
    return res.status(200).send({
        success:true,
        message:'Already Register please login'
    })
}
//register user
  const hashedPassword = await hashPassword(password)
  //save
  const user =await new userModel({name,email,phone,address,password:hashedPassword}).save()
    
    res.status(201).send({
        success:true,
        message:'User Register Successfully',
        user
    })
    } catch (error) {
        console.log(error)
        resizeBy.status(500).send({
            success : false,
            message: 'Error in Registration',
            error
        })
    }
};

//POST LOGIN
export const loginController = async(req,res) =>{
    try {
        const{email,password} = req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered'
            })
        }
    const match = await comparePassword(password,user.password)
    if(!match){
        return res.status(200).send({
            success:false,
            message:'Invalid Passsword'
        })
    }
    //token
    const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    res.status(200).send({
        success:true,
        message: "login successfully",
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
        },
        token,
    })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
        
    }
};

//forgotpassword controller

export const forgotPasswordController = async(req,res)=>{
    try {
        const{email,answer,newPassword}=req.body;
        if(!email){
            res.staus(400).send({message:"Email is required"})
        }
        if(!answer){
            res.staus(400).send({message:"answer is required"})
        }
        if(!newPassword){
            res.staus(400).send({message:"newPassword is required"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error
        })
    }
}

//test controller
export const testController = (req,res)=>{
    res.send("protected Route");
    
};


