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
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization, Custom-Header',
  exposedHeaders: ['Custom-Header'],
  credentials: true,
  maxAge: 3600,
  optionsSuccessStatus: 200,
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
//schemas
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  userId: String,
  phoneNumber: String,
  address: String,
  city: String,
  country: String,
  postalCode: String,
  resume: String,
  adhar: String,
  pan: String,
  password: String,
  photo: String,
  role: String,
  trainerType: String,
  skills: String,
  salary: String,
  bankAccounts: [
    {
      bankName: String,
      branchCode: String,
      accountNumber: String,
      ifscNumber: String,
    },
  ],
});
const institutionSchema = new mongoose.Schema({
  collegeName: String,
  eamcetCode: String,
  gstNumber: String,
  panNumber: String,
  email: String,
  phoneNumber: String,
  address: String,
  city: String,
  country: String,
  postalCode: String,
  chairmanName: String,
  chairmanEmail: String,
  chairmanPhoneNumber: String,
});

const Institution = mongoose.model('Institution', institutionSchema);
const User = mongoose.model('user', UserSchema);

//



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


app.post('/user/add', async (req, res) => {
  const userData = req.body;
  const email= req.body.email;
  const existingUser = await User.findOne({ email: email });
  try {
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
        }

    if (!userData.trainerType){
      userData.role="1"
    }else{
      userData.role="2"
    }
    if (!userData.password) {
      userData.password = 'Capta@123';
    }
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/user/manage', async (req, res) => {
  try {
    // Exclude users with the role "admin"
    const users = await User.find({ role: { $ne: 'admin' } }, { password: 0 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// adding an institution
app.post('/college/add', async (req, res) => {
  try {
    const institutionData = req.body;
    const newInstitution = new Institution(institutionData);
    await newInstitution.save();
    res.status(200).json({ message: 'Institution added successfully' });
  } catch (error) {
    // console.error('Error adding institution:', error);
    res.status(500).json({error: 'Internal server error' });
  }
});
app.post('/college/manage', async (req, res) => {
  try {
    const colleges = await Institution.find({}, 'collegeName eamcetCode email phoneNumber');

    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

