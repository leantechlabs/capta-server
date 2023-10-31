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

const MOUSchema = new mongoose.Schema({
  Date:String,
  Location: String,
  FirstParty: [{
    Name: String,
    Address: String,
    Representative: String ,
    Contact: String
  },
],

  SecondParty:[ { Name: String, Location: String, Representative: String },],
  TermsConditions: [{
    NatureRelationship: String,
    MutualObligation: String,
    LimitationsWarranties: String,
  },],
  PurposeScope: [{ Details: String, CollaborationPeriod: String, OtherDetails: String },],
  PaymentTerms: [{
    AmountPerStudent: String,
    PaymentSchedule: String,
    PaymentMethod: String,
  },],
  Termination: [{ TerminationConditions: String, PaymentDue: String },],
}
 
);

const curriculumSchema = new mongoose.Schema({
  CurriculumName: String,
  excelData: [
    {
      engine: String,
      top_p: String,
      temp: String,
      max_tokens: String,
      prompt: String,
      output:String,
      elapsed_time: String
    },
    {
      engine: String,
      top_p: String,
      temp: String,
      max_tokens: String,
      prompt: String,
      output:String,
      elapsed_time: String
    },
    {
      engine: String,
      top_p: String,
      temp: String,
      max_tokens: String,
      prompt: String,
      output:String,
      elapsed_time: String
    }
  ]
})



const Institution = mongoose.model('Institution', institutionSchema);
const User = mongoose.model('user', UserSchema);


const Mou = mongoose.model('MOU' , MOUSchema);

const Curriculum = mongoose.model( 'cur',curriculumSchema)

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

  
 app.post('/mou/create', async (req, res) => {
  try {
    const MouData = req.body;
    const newMou = new Mou(MouData);
    await newMou.save();
    res.status(200).json({ message: 'Mou added successfully' });
  } catch (error) {
    
    // console.error('Error adding institution:', error);
    res.status(500).json({error: 'Internal server error' });
  }
});

app.post('/mou/confirm', async (req, res) => {
  try {
    const confirmationStatus = req.body;
    const confirmed = new Mou(confirmationStatus);
    await confirmed.save();
    res.status(200).json({ message: 'MOU confirmation submitted successfully' });
  } catch (error) {

    res.status(500).json({error: 'MOU confirmation not Submitted' });
  }
});

app.post('/mou/manage', async (req, res) => {
  try {
    const action = req.body.action; 
    const itemId = req.body.itemId; 
    const updatedStatus = req.body.status; 

    
    const items = [
      { id: 1, name: 'Item 1', status: 'Pending' },
      { id: 2, name: 'Item 2', status: 'Confirmed' },
      { id: 3, name: 'Item 3', status: 'Rejected' },
    ];

    if (action === 'edit') {

      const itemToEdit = items.find(item => item.id === itemId);
      if (itemToEdit) {
        itemToEdit.status = updatedStatus;
        res.send(`Item with ID ${itemId} has been updated.`);
      } else {
        res.send(`Item with ID ${itemId} not found.`);
      }
    } else if (action === 'delete') {
     
      const indexToDelete = items.findIndex(item => item.id === itemId);
      if (indexToDelete !== -1) {
        items.splice(indexToDelete, 1);
        res.send(`Item with ID ${itemId} has been deleted.`);
      } else {
        res.send(`Item with ID ${itemId} not found.`);
      }
    } else {
      
      res.send(`Unsupported action: ${action}`);
    }
  } catch (error) {
    
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
  
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});



