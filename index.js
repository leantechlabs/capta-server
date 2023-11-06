const express = require ('express');
const  dotenv= require ('dotenv') 
const mongoose = require ('mongoose');
const  bodyParser = require ('body-parser');
const cors = require ('cors');
const bcrypt = require ('bcryptjs');
const { ObjectId } = require('mongodb');
const  nanoid  = require('nanoid'); 


const app = express();
const port = process.env.PORT || 3001;
dotenv.config(); 
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

const CurriculumSchema = new mongoose.Schema({
  
  CurriculumName: String,
  topics: [
    {
      Day: Number,
      Topic: String,
      'Sub Topic': String,
      'Practice Programs': String,
      Hours: Number,
    },
  ],
});

const ModuleSchema = new mongoose.Schema({
  Curriculum : String,
  ModuleName : String,
  TotalHours : Number,
  TotalDays:Number,
  TotalBatches:Number,
  StartDate:Date,
  EndDate:Date,

});


const mouSchema = new mongoose.Schema({
  MOUID: String,
  Date: {
    type: String,
    default: Date.now
  },
  Location: {
    type: String,
  },
  FirstParty: {
    Name: String,
    Address: String,
    Representative: String,
    Contact: String,
  },
  SecondParty: {
    Name: String,
    Location: String,
    Representative: String,
  },
  TermsConditions: {
    NatureOfRelationship: String,
    MutualObligation: String,
    LimitationsAndWarranties: String,
  },
  PurposeScope: {
    Details: String,
    CollaborationPeriod: String,
    OtherDetails: String,
  },
  PaymentTerms: {
    AmountPerStudent: Number,
    FirstInstallment: Number,
    SecondInstallment: Number,
    ThirdInstallment: Number,
    FinalInstallment: Number,
    PaymentMethod: String,
  },
  Termination: {
    TerminationConditions: String,
    PaymentDue: String,
  },
  Confirmation: {
    Cdate: String,
    CStatus: String,
    Comments:String,
  },
});


const Institution = mongoose.model('Institution', institutionSchema);
const User = mongoose.model('user', UserSchema);
const Curriculum = mongoose.model('Curriculum', CurriculumSchema);
const Module = mongoose.model('Module' , ModuleSchema);
const MOU = mongoose.model('MOU', mouSchema);


////



app.post('/mou/create', async (req, res) => {
  try {
    // Generate a unique random MOUID
    let uniqueMOUID;
    let isUnique = false;

    while (!isUnique) {
      uniqueMOUID = nanoid(6); // Generate a random 6-character MOUID
      // Check if the generated MOUID is unique
      const existingMOU = await MOU.findOne({ MOUID: uniqueMOUID });
      if (!existingMOU) {
        isUnique = true;
      }
    }

    // Create a new MOU document with the generated MOUID
    const newmouSchema = new MOU({
      MOUID: uniqueMOUID,
      // Other fields here
    });

    newmouSchema.Confirmation.Cdate = null;
    newmouSchema.Confirmation.CStatus = null;
    newmouSchema.Confirmation.Comments = null;

    await newmouSchema.save();
    res.status(200).send({
      message: "MOU Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `MOU Creation Error ${error.message}`,
    });
  }
});

// app.post("/mou/confirm",async(req,res)=>{
//     try {
//         const newMouConf = new MOUConfi(req.body);
//         await newMouConf.save()
//         res.status(200).send({
//             message: "MOU Confirmation Sucessfully",
//             success:false,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success:false,
//             message:`MOU Confirmation Error ${error.message}`
//         });
//     }
// })



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

  app.post('/curriculum/create', async (req, res) => {
    try {
      const { CurriculumName, excelData } = req.body;
      const newCurriculum = new Curriculum({ CurriculumName });
      const savedTopics = [];
  
      for (const data of excelData) {
        savedTopics.push(data); // No need to create a separate topic, directly push data.
      }
  
      newCurriculum.topics = savedTopics;
  
      await newCurriculum.save();
  
      res.status(201).json({ message: 'Data received and saved successfully' });
    } catch (error) {
      console.error('Error saving curriculum data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.post('/curriculum/manage', async (req, res) => {
    try {
      const curriculums = await Curriculum.find({}, '_id CurriculumName topics.Hours topics.Day');
  
      const curriculumsWithStats = curriculums.map((curriculum) => {
        let totalHours = 0;
        let totalDays = new Set(); //  Set to avoid duplicate days
  
        for (const topic of curriculum.topics) {
          totalHours += topic.Hours;
          totalDays.add(topic.Day); //  Set to collect unique days
        }
  
        // Create a new object with the desired properties
        return {
          _id: curriculum._id,
          CurriculumName: curriculum.CurriculumName,
          TotalHours: totalHours,
          TotalDays: totalDays.size, //  size of the Set to get the unique day count
        };
      });
  
      res.json(curriculumsWithStats);
    } catch (error) {
      console.error('Error fetching curriculums:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  //Add a new route to fetch curriculum names
  app.get('/curriculum/names' , async (req , res) => {
    try {
      const curriculumNames = await Curriculum.find({} , 'CurriculumName');
      res.status(200).json(curriculumNames);
    } catch (error) {
      console.error('error fetching curriculum name : ' , error);
      res.status(500).json({error : 'Internal server error'});
    }
  });

  app.post('/module/create' , async (req , res) => {
    try{
      const {
        Curriculum,
        ModuleName,
        TotalHours,
        TotalDays,
        TotalBatches,
        StartDate,
        EndDate,
      } = req.body;

      //Basic Input Validation
      if (!Curriculum || !ModuleName || !TotalHours || !TotalDays || !TotalBatches || !StartDate || !EndDate) {
        return res.status(400).json({ message: 'All fields are required' });
      };
      

      const newModule = new Module({
        Curriculum,
        ModuleName,
        TotalHours,
        TotalDays,
        TotalBatches,
        StartDate,
        EndDate,
      });

      await newModule.save();
      res.status(201).json({message : 'Module created successfully'});
    } catch(error){
      console.error('Error creating module: ' , error)
      res.status(500).json({message : 'Internal server error'});
    }
  });



  app.post('/module/manage' , async (req , res) => {
    try{
      const modules =  await Module.find({} , '_id ModuleName TotalHours TotalDays TotalBatches StartDate EndDate');

      res.json(modules);
    } catch(error){
      console.error('Error fetching module : ' , error);
      res.status(500).json({error : 'Internal server error'})
    }
  });

  
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

