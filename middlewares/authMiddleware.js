const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler (async (req, res, next) => {

    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
        
        try{
            if(token){
                const decoded =jwt.verify(token, process.env.JWT_SECRET);
                const user =  await User.findById(decoded?.id);
                req.user = user;
                next();
                
            }
        }catch(error){
            throw new Error("Authorized token expired. Please try again.");
        }
    }else{
        throw new Error('No attached token found in header.');
    }
});
// check if admin
const isAdmin = asyncHandler (async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== 'admin'){
        throw new Error('Your have not an admin role.');
    }else{
        next(); 
    }
});
module.exports = {authMiddleware, isAdmin};