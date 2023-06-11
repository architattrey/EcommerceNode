const { default: mongoose } = require('mongoose');

const db = () => {
    try{
        const dbConnection = mongoose.connect(process.env.MONGODB_URL);
        console.log('successfully connected');
    } catch (error){
        console.log('Database Error.');
    }

};
module.exports = db;