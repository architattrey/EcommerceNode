const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

const create = asyncHandler(async (req, res)=>{
    try{
        res.json({
            message:"product Created Successfully.",
            status:'success',
            code:200
        });
    }catch(error){
        throw Error(error);
    }
});
module.exports = {create};