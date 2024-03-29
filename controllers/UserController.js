const jwt = require('jsonwebtoken');
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
                return res.json({
                    data:createNewUser,
                    message:"User Created Successfully.",
                    status:'success',
                    code:200
                });
            }
            return res.json({
                message:"User Already Exist",
                status:'failed',
                code:200
            });
            
        }
        return res.json({
            message:"Please provide the email id",
            status:'failed',
            code:200
        });
        
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
                    refresh_token:newToken,
                }, {new:true});
                //  set the cookie for token with help of cookie parser module
                res.cookie('refresh_token', newToken, {
                    httpOnly: true,
                    maxAge: 72 * 60 * 60 * 1000,
                });
                return res.status(200).json({
                    status:'success', 
                    code:"200", 
                    data: {
                        'id':findUser?._id,
                        'email':findUser?.email,
                        'mobile':findUser?.mobile,
                        'firstname':findUser?.first_name,
                        'lastname':findUser?.last_name,
                        'token': newToken
                    }
                });
            }
            return res.status(401).json({ 
                status: "failed", 
                code:"401",
                error: 'Invalid credentials' 
            }); 
        }
        return res.status(404).json({ 
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
            return res.status(200).json({
                status:"success",
                code:200,
                data:users
            });  
        }
        return res.status(404).json({ 
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
                return res.status(200).json({
                    status:"success",
                    code:200,
                    data:user
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
// generate the fresh token by the cookie token
const handleRefereshToken = asyncHandler(async(req, res)=>{
    const cookie = req.cookies; // get the cookie
    if(!cookie?.refresh_token){
        return res.status(500).json({
            status: "failed",
            code: 500,
            error: 'no token found in cookie. Please try again.',
        });  
    }
    const refereshToken = cookie.refresh_token; // get token from the cookie
    const user = await User.findOne({'refresh_token':refereshToken}); // find user by token
    if(!user){
        return res.status(500).json({
            status: "failed",
            code: 500,
            error: 'no token found in records or not created yet.',
        });  
    }
    jwt.verify(refereshToken, process.env.JWT_SECRET, (err, decoded) => {// verify the token 
        if(err || user.id !== decoded.id){
            return res.status(500).json({
                status: "failed",
                code: 500,
                error: 'something went wrong with referesh token.',
            });  
        }
        const newToken =  generateToken(user.id);
        return res.status(201).json({
            status: "success",
            code: 201,
            new_token: newToken,
        });
    });
});
// logout the user
const logout = asyncHandler(async (req, res)=>{
    const cookie = req.cookies; // get the cookie
    if(!cookie?.refresh_token){
        return res.status(500).json({
            status: "failed",
            code: 500,
            error: 'no token found in cookie. Please try again.',
        });  
    }
    const token = cookie.refresh_token; // get token from the cookie
    const user = await User.findOne({'refresh_token':token}); // find user by token
    if(!user){
        return res.status(500).json({
            status: "failed",
            code: 500,
            error: 'no token found in records or not created yet.',
        });  
    }
    // reset the cookie
    res.clearCookie('refresh_token',{
        httpOnly:true, // using for http request only for the security reasons 
        secure:true //the cookie will only be sent over HTTPS connections. This ensures that the cookie is encrypted and protected from interception during transmission.
    });
    // reset the value again
    const updateToken = await User.findOneAndUpdate(
        { 'refresh_token': token },
        { 'refresh_token': '' }, // Replace 'NEW_REFRESH_TOKEN_VALUE' with the new token value.
        { new: true } // The 'new' option returns the updated document.
      );
    return res.status(200).json({
        status: "success",
        code: 200,
        message: "User Successfully loged out.",
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
    handleRefereshToken,
    logout,
};