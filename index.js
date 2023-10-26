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
const DBurl= "mongodb+srv://"+process.env.DB_NAME+":"+process.env.DB_NAME+"@cluster0.9fiyo2y.mongodb.net/?retryWrites=true&w=majority";
// Replace this with your MongoDB Atlas connection URLtalas
// Connect to MongoDB Atlas
mongoose.connect(DBurl,{ useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Event handlers for Mongoose connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB Atlas');
  //
});
// Example API routes
//const userRouter = require('./routes/user');
app.get('/',(req,res)=>{
    res.send({Message:"Server is Live"});
})
app.get('/login',(req,res)=>{
    res.send({Message:"Login Page"});
})
app.get('/login',(req,res)=>{
    res.send({Message:"Login Page"});
})
app.post('/user/add', (req, res) => {
    // Print the received data to the console
    console.log('Received data:', req.body);
  
    // Send a response to the client
    res.json({ message: 'Data received successfully' });
  });
  
  app.post('/college/add', (req, res) => {
    // Print the received data to the console
    console.log('Received data:', req.body);
  
    // Send a response to the client
    res.json({ message: 'Data received successfully' });
  });
  
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
