const { generateToken } = require('../config/jwtToken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefereshToken } = require('../config/refereshToken');



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
                // generate the fresh token using referesh token js file then will update in user table
              
                const newToken = await generateRefereshToken(findUser?._id);
               
                await User.findByIdAndUpdate(findUser._id, {
                    referesh_token:newToken,
                }, {new:true});
                //  set the cookie for token with help of cookie parser module
                res.cookie('referesh_token', newToken, {
                    httpOnly: true,
                    maxAge: 72 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    status:'success', 
                    code:"200", 
                    data: {
                        'id':findUser?._id,
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
            validateMongodbId(id);
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
            
            const {id} = req.user;
            const user = await User.findById(id);

            if(user){
                const updatedUser = await User.findByIdAndUpdate(id, 
                    {
                        first_name:req.body.first_name,
                        last_name:req.body.last_name,
                        email:req.body.email,
                        mobile:req.body.mobile,
                    }, 
                    {
                        new: true, // To get the updated user object as the result
                    }
                );
      
                if (updatedUser) {
                    return res.status(201).json({
                        status: "success",
                        code: 201,
                        data: updatedUser,
                    });
                } 
                return res.status(500).json({
                    status: "failed",
                    code: 500,
                    error: 'Something went wrong. Please try again.',
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
            code: 400,
            error: 'Bad Parameters.',
        });
      
    } catch (error) {
      throw new Error(error);
    }
});
// block the user
const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const user = await User.findById(id);

    if(user){
        const block = await User.findByIdAndUpdate(id, 
            {
                isBlocked:true,    
            }, 
            {
                new: true, // To get the updated user object as the result
            }
        );

        if (block) {
            return res.status(201).json({
                status: "success",
                code: 201,
                message: "User Sucessfully blocked.",
            });
        } 
        return res.status(500).json({
            status: "failed",
            code: 500,
            error: 'Something went wrong. Please try again.',
        });  
    }
    return res.status(404).json({ 
        status: "failed", 
        code:"404", 
        error: 'User Not found' 
    });
});

// ublock the user
const unblockUser = asyncHandler(async (req, res)=>{
    const {id} = req.user;
    const user = await User.findById(id);

    if(user){
        const unblock = await User.findByIdAndUpdate(id, 
            {
                isBlocked:false,    
            }, 
            {
                new: true, // To get the updated user object as the result
            }
        );

        if (unblock) {
            return res.status(201).json({
                status: "success",
                code: 201,
                message: "User Successfully unblocked.",
            });
        } 
        return res.status(500).json({
            status: "failed",
            code: 500,
            error: 'Something went wrong. Please try again.',
        });  
    }
    return res.status(404).json({ 
        status: "failed", 
        code:"404", 
        error: 'User Not found' 
    });

});
module.exports = {
    createUser,
    loginUser,
    users,
    user, 
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
};