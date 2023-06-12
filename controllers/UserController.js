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
                success:true,
                code:200
            });
        }else{
            res.json({
                message:"User Already Exist",
                success:false,
                code:200
            });
        }
    }else{
        res.json({
            message:"Please provide the email id",
            success: false,
            code:200
        });
    }     
});
module.exports = {createUser};