const express = require('express');
const dbConnect = require('./config/db');
const authRouter = require('./routes/authRoute');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000; // port is runing from .env file 

dbConnect; 


app.listen(PORT, ()=>{
    console.log(`Server runnig at PORT" ${PORT}`);
});

app.use('api/user', authRouter);

app.use('/', (req, res)=>{
    res.send('server running.');
});
// // module.exports = app;