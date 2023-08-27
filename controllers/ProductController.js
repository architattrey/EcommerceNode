const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const create = asyncHandler(async (req, res)=>{
    try{
        if(req.body.title){
           
            const length = 3; // Length of the random string
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const randomString = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
            req.body.slug = slugify(req.body.title) +'-'+ randomString;
        }
        const createdProduct = await Product.create(req.body); // product created in this query
        if(createdProduct._id){
            return res.status(200).json({
                message:"Product Created Successfully.",
                status:'success',
                code:200
            });
        }
        return res.status(500).json({
            message:"Something went wrong with the request. Please contact to Admin.",
            status:"error",
            code:500
        });
       
    }catch(error){
        throw Error(error);
    }
});
// get all products
const products = asyncHandler(async(req, res)=>{
    try{
        const products = await Product.find();
        if(products){
            return res.status(200).json({
                status:"success",
                code:200,
                data:products
            });  
        }
        return res.status(200).json({
            status:"failed",
            code:200,
            message:"Products not found."
        });
    }catch(error){
        throw Error(error);
    }
});
// show the single product
const show = asyncHandler(async (req, res)=> {
    try{
        if(req.params){
            const product = await Product.findById(req.params.id);
            if(product){
                return res.status(200).json({
                    status:"success",
                    code:200,
                    data:product
                }); 
            }
            return res.status(404).json({ 
                status: "failed", 
                code:"404", 
                error: 'Product Not found.' 
            });  
        }
        return res.status(500).json({
            status:"failed",
            code:500,
            message:"Bad parameters. Please try again."
        });
    }catch(error){
        throw Error(error);
    }
});
// show the single product
const update = asyncHandler(async (req, res)=> {
    try{
        if(req.params.id){
            const id = req.params.id;
            const product = await Product.findById(id);

            if(product){
                if(req.body.title){
                    const length = 3; // Length of the random string
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const randomString = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
                    req.body.slug = slugify(req.body.title) +'-'+ randomString;
                }
                const updatedProduct = await Product.findByIdAndUpdate( id,  req.body,
                    {
                        new:true,
                    }
                );
                if(updatedProduct){
                    return res.status(201).json({
                        status:"success",
                        code:201,
                        data:updatedProduct
                    });
                }
                return res.status(500).json({
                    status:"failed",
                    code:500,
                    message:"Something went wrong. Please contact to admin."
                });
            }
            return res.status(404).json({
                status:"failed",
                code:404,
                message:"Product not found."
            });
        }
        return res.status(500).json({
            status:"failed",
            code:500,
            message:"Bad parameters. Please try again."
        });
    }catch(error){
        throw Error(error);
    }
});
// show the single product
const destroy = asyncHandler(async (req, res)=> {
    try{
        if(req.params){
            
            const { id } = req.params;
            const product =  await Product.findById(id);
            
            if(product){
                await product.deleteOne();
                return res.status(200).json({
                    status:"success",
                    code:200,
                    message:'product successfully deleted.'
                });  
            }
            return res.status(404).json({ 
                status: "failed", 
                code:"404", 
                error: 'product Not found' 
            });  
        }
        return res.status(400).json({ 
            status: "failed", 
            code:"400", 
            error: 'Bad Perameters.' 
        });

    }catch(error){
        throw Error(error);
    }
});
module.exports = {create, products, show, update, destroy};