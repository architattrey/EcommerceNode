const User = require('../models/User');
const asyncHandler = require('express-async-handler');


const createUser = asyncHandler( async (req, res) => {

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
});
// to login the user
const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({ email });

    if(findUser){
        // check the password from user schema
        if(await findUser.isPasswordMatched(password)){
            res.status(200).json({
                status:'success', 
                code:"200", 
                'data': findUser
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
        code:"401", 
        error: 'User Not found' 
    }); 
}); 

module.exports = {createUser, loginUser};