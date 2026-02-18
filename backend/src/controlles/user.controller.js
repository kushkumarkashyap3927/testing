import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";



export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    return res.status(200).json(new apiRes(200, { users }, "Users fetched successfully"));
});

export const signupUser = asyncHandler(async (req, res) => {
  const { email, fullName , password ,desc , role} = req.body;
  const user = await User.create({
    email,
    fullName,
    password,
    desc,
    role
  });


  if(!user)  throw new apiError(400, "User creation failed");

   let {password: _, ...userData} = user.toObject();
 return res.status(200).json(new apiRes(200, { user: userData }, "User created in successfully"));
});


export const loginUser = asyncHandler(async(req, res)=>{
    const {email , password} = req.body;
    const user  = await User.findOne({email});

    if(!user) throw new apiError(404 , "User not Found");

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid) throw new apiError(401, "Invalid Password");

    let {password: _, ...userData} = user.toObject();

    return res.status(200).json(new apiRes(200 ,{user: userData}, "Loggedin successfully"));
})

export const getUserProfile = asyncHandler(async(req, res)=>{
    console.log("Get profile request user:", req.user); // Debugging log
    const {email} = req.body;


    const user = await User.findOne({email}).select("-password");
    console.log("Fetched user profile:", user); // Debugging log

    if(!user) throw apiError(404, "User not found");

    let {password: _, ...userData} = user.toObject();

    return res.status(200).json(new apiRes(200, {user: userData}, "User profile fetched successfully"));
})


export const logoutUser = asyncHandler(async(req, res)=>{
    // Implement logout logic, e.g., invalidate token or clear session
    return res.status(200).json(new apiRes(200, null, "Logged out successfully"));
});


export const deleteUser = asyncHandler(async(req, res)=>{
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user) throw apiError(404, "User not found");

    const deletedUser = await User.findOneAndDelete({email});

    if(!deletedUser) throw apiError(404, "User not found");

    return res.status(200).json(new apiRes(200, null, "User deleted successfully"));
});




