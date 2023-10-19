import dotenv from 'dotenv'
dotenv.config(); 
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/captaDB', { useNewUrlParser: true, useUnifiedTopology: true });
// const connection = mongoose.connection;

// connection.once('open', () => {
//     console.log('MongoDB database connection established successfully');
// });

// Example API routes
//const userRouter = require('./routes/user');
app.get('/',(req,res)=>{
    res.send({Message:"Server is Live"});
})
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
