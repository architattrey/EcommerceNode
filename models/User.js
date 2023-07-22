const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        index:true,
    },
    last_name:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    refresh_token:{
        type:String,
    },
    cart:{
        type:Array,
        default:[],
    },
    address:[{ type: mongoose.Schema.Types.ObjectId, ref:"Address"}],
    wishlist:[{type: mongoose.Schema.Types.ObjectId, ref:"Product"}],
},
{
    timestamps:true,
}
);

// password hashing
userSchema.pre("save", async function (next){
    const saltRounds = 10
    const salt = await bcrypt.genSaltSync(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
});
//compare the user password .. will return false and true
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); 
}
//Export the model
module.exports = mongoose.model('User', userSchema);