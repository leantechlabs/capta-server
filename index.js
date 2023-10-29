import dotenv from 'dotenv'
dotenv.config(); 
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.ORIGIN,
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization,Custom-Header',
};


app.use(bodyParser.json());
app.use(cors()); //mongodb+srv://captadb:captadb@cluster0.9fiyo2y.mongodb.net/?retryWrites=true&w=majority
const DBurl = "mongodb+srv://" + process.env.DB_NAME + ":" + process.env.DB_NAME + "@cluster0.9fiyo2y.mongodb.net/capta?retryWrites=true&w=majority";
mongoose.connect(DBurl,{ useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB Atlas');
  //
});
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role:String,
  userId:String,
});

const User = mongoose.model('user', userSchema);

// // Registration route
// app.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const existingUser = await User.findOne({ email: email });

//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     // Encrypt the password before storing it
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword, // Store the hashed password
//       role: 'admin',
//       userId: '1001',
//     });
//     await newUser.save();

//     return res.status(200).json({ message: 'User registered successfully' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });


app.get('/',(req,res)=>{
    res.send({Message:"Server is Live"});
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});




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
  
  app.post('/session/attendance', (req, res) => {
    // Print the received data to the console
    console.log('Received data:', req.body);
  
    // Send a response to the client
    res.json({ message: 'Data received successfully' });
  });

  app.post('/curriculum/create', (req, res) => {
    // Print the received data to the console
    console.log('Received data:', req.body);
  
    // Send a response to the client
    res.json({ message: 'Data received successfully' });
  });
  
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
