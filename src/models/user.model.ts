import mongoose,{Schema,Document, Model} from "mongoose";

interface UserDocument extends Document{
    firstName:string;
    lastName:string;
    phoneNo:string;
    email:string;
    password:string;
}

const userSchema=new Schema<UserDocument>({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    phoneNo:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
},{timestamps:true});

const User:Model<UserDocument>=mongoose.model<UserDocument>('User',userSchema);

export {User,UserDocument};