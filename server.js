const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const dbConnect = require('./config/db');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const socketIO = require('socket.io');
const {notFound, errorHandler} = require('./middlewares/errorHandler');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000; // port is runing from .env file 

dbConnect(); 
const server = http.createServer(app);
const io = socketIO(server);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.listen(PORT, ()=>{
    console.log(`Server runnig at PORT" ${PORT}`);
});

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use(notFound);
app.use(errorHandler);

// app.use('/', (req, res)=>{ 
//     res.send('server running.');
// });
// // module.exports = app;