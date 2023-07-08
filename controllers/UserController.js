const { generateToken } = require('../config/jwtToken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');


const createUser = asyncHandler( async (req, res) => {
    try{
        const email = req.body.email;
        // check the mail id is in body or not

        if(email){
            const findUser = await User.findOne({email:email}); // find user by email

            // check the user that existing or not
            if(!findUser){
                const createNewUser = await User.create(req.body); // user created in this query
                res.json({
                    data:createNewUser,
                    message:"User Created Successfully.",
                    status:'success',
                    code:200
                });
            }else{
                res.json({
                    message:"User Already Exist",
                    status:'failed',
                    code:200
                });
            }
        }else{
            res.json({
                message:"Please provide the email id",
                status:'failed',
                code:200
            });
        }     
    }catch(error){
        throw Error(error);
    }
});
// to login the user
const loginUser = asyncHandler( async (req, res) => {
    try{
        const {email, password} = req.body;
        const findUser = await User.findOne({ email });
        if(findUser){
            // check the password from user schema
            if(await findUser.isPasswordMatched(password)){
                res.status(200).json({
                    status:'success', 
                    code:"200", 
                    data: {
                        'email':findUser?.email,
                        'mobile':findUser?.mobile,
                        'firstname':findUser?.first_name,
                        'lastname':findUser?.last_name,
                        'token': generateToken(findUser?._id)
                    }
                });
            }
            res.status(401).json({ 
                status: "failed", 
                code:"401",
                error: 'Invalid credentials' 
            }); 
        }
        res.status(404).json({ 
            status: "failed", 
            code:"404", 
            error: 'User Not found' 
        }); 
    }catch(error){
        throw Error(error);
    }    
});

// to get the all users listing

const users = asyncHandler( async (req, res) => {
    try{
        let users = await User.find();
        if(users){
            res.status(200).json({
                status:"success",
                code:200,
                data:users
            });  
        }
        res.status(404).json({ 
            status: "failed", 
            code:"404", 
            error: 'Users Not found' 
        });
    }catch(error){
        throw new Error(error);
    }
});
// get a single user according to user id
const user = asyncHandler( async(req, res) => {
    try{
        if(req.params){
            const id = req.params.id;
            const user = await User.findById(id);
            if(user){
                res.status(200).json({
                    status:"success",
                    code:200,
                    data:user
                }); 
            }
            res.status(404).json({ 
                status: "failed", 
                code:"404", 
                error: 'User Not found' 
            });  
        }
        res.status(400).json({ 
            status: "failed", 
            code:"400", 
            error: 'Bad Perameters.' 
        });
    }catch(error){
        throw new Error(error);
    }   
});
// delete user
const deleteUser = asyncHandler (async(req, res) =>{
    try{

        if(req.params){
            const { id } = req.params;
            const user =  await User.findById(id);
            
            if(user){
                await user.deleteOne();
                return res.status(200).json({
                    status:"success",
                    code:200,
                    message:'user successfully deleted.'
                }); 
                
            }
            return res.status(404).json({ 
                status: "failed", 
                code:"404", 
                error: 'User Not found' 
            });  
        }
        return res.status(400).json({ 
            status: "failed", 
            code:"400", 
            error: 'Bad Perameters.' 
        });

    }catch(error){
        throw new Error(error);
    }
}); 
// update a user
const updateUser = asyncHandler(async (req, res) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const updateData = req.body; // Assuming the updated data is sent in the request body
  
            const updatedUser = await User.findByIdAndUpdate(id, updateData, {
                new: true, // To get the updated user object as the result
            });
  
            if (updatedUser) {
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    data: updatedUser,
                });
            } 
            return res.status(500).json({
                status: "failed",
                code: 500,
                error: 'Something went wrong. Please try again.',
            });
    
        }
        return res.status(400).json({
            status: "failed",
            code: 400,
            error: 'Bad Parameters.',
        });
      
    } catch (error) {
      throw new Error(error);
    }
});
  
module.exports = {
    createUser,
    loginUser,
    users,
    user, 
    deleteUser,
    updateUser
};