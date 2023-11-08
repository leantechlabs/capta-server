
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

app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //mongodb+srv://captadb:captadb@cluster0.9fiyo2y.mongodb.net/?retryWrites=true&w=majority
const DBurl = "mongodb+srv://" + process.env.DB_NAME + ":" + process.env.DB_NAME + "@cluster0.9fiyo2y.mongodb.net/capta?retryWrites=true&w=majority";

mongoose.connect(DBurl,{ useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB Atlas');
  //
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// const User = mongoose.model('User', new mongoose.Schema({
//   email: String,
//   password: String,
//   role:String,
// }));
passport.use(new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password' 
},
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


schemas
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

// <<<<<<< main
// =======
// // app.post("/mou/confirm",async(req,res)=>{
// //     try {
// //         const newMouConf = new MOUConfi(req.body);
// //         await newMouConf.save()
// //         res.status(200).send({
// //             message: "MOU Confirmation Sucessfully",
// //             success:false,
// //         });
// //     } catch (error) {
// //         console.log(error);
// //         res.status(500).send({
// //             success:false,
// //             message:`MOU Confirmation Error ${error.message}`
// //         });
// //     }
// // })
// >>>>>>> main


app.get('/',(req,res)=>{
    res.send({Message:"Server is Live"});
})



app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      console.log('Failure redirect');
      if (info && info.message === 'Incorrect username.') {
        return res.status(401).json({ message: 'Username not found' });
      }
      return res.status(401).json({ message: 'password is incorrect' });
    }
    const userRole = user.role || 'admin';
    console.log(user.role,user);
    if (userRole==+"2"){
      userRole= "trainer";
    }

    console.log('User ID before session set:', user.id);
    const payload = { userId: user.id, role: userRole };
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
    console.log(payload,token);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    console.log('Session data before setting userId:', req.session,req.session.id);

    req.session.userId = user.id;
    req.session.userRole = user.role; 
    console.log('Session data after setting userId:', req.session);

    return res.status(200).json({ token, message: 'Logged in' });
  })(req, res, next);
});


const checkPermission = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const tokenb = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenb, 'your-secret-key');
    // const userRole = decoded.role; 
    const userRole=req.
    console.log(req.body,decoded);

    // if (userRole === 'admin') {
    //   return next();
    // }
    const resourcePath = req.body.url;
    console.log("route path",resourcePath);

    const resourcePermissions = await Permission.findOne({ page: resourcePath });
    console.log("hi");
    console.log(resourcePermissions,resourcePermissions[userRole],userRole,"jdcnjndcsdj");
    console.log("hi");

    if (!resourcePermissions) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (userRole && resourcePermissions[userRole]) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }

  } catch (error) {
    console.log("ent");
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/page', checkPermission, (req, res) => {
  res.status(200).json({ message: 'Access granted' });
  console.log("entered");
});

//change profile Details
app.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
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
    res.status(200).json({ message: "Institution added successfully" });
  } catch (error) {
    // console.error('Error adding institution:', error);
    res.status(500).json({ error: "Internal server error" });
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
const permissionSchema = new mongoose.Schema({
  page: String,
  admin: Boolean,
  moderator: Boolean,
  trainer: Boolean,
});
const Permission = mongoose.model('Permission', permissionSchema);

app.get('/settings/system', async (req, res) => {
  try {
    console.log('setting - userId:', 'sessionID:', req.sessionID,req.session);

    const permissions = await Permission.find({}).exec();
    const permissionsMap = {};
    permissions.forEach((permission) => {
      permissionsMap[permission.page] = {
        admin: permission.admin,
        moderator: permission.moderator,
        trainer: permission.trainer,
      };
    });
    res.status(200).json(permissionsMap);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to retrieve permissions' });
  }
});

app.post('/settings/system', async (req, res) => {
  try {
    const { permissions } = req.body;

    const permissionUpdates = Object.keys(permissions).map((page) => ({
      updateOne: {
        filter: { page },
        update: {
          admin: permissions[page].admin,
          moderator: permissions[page].moderator,
          trainer: permissions[page].trainer,
        },
      },
    }));

    await Permission.bulkWrite(permissionUpdates);

    res.status(200).json({ message: 'Permissions updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update permissions' });
  }
});


app.post('/pages', async (req, res) => {
  const { page, admin, moderator, trainer } = req.body;
  console.log(req.session.id);

  try {
    let existingPermission = await Permission.findOne({ page });

    if (existingPermission) {
      res.status(400).json({ error: 'Page already exists' });
    } else {
      const newPermission = new Permission({
        page,
        admin,
        moderator,
        trainer,
      });
      await newPermission.save();
      res.status(201).json({ message: 'Page and permissions added successfully' });
    }
  } catch (error) {
    console.error('Error adding page and permissions:', error);
    res.status(500).json({ error: 'Failed to add page and permissions' });
  }
});

app.get('/api/permissions', async (req, res) => {
  try {
    const { role } = req.query;

    const permissions = await Permission.find({ [role]: true });

    const allowedPages = permissions.map(permission => permission.page);
console.log(permissions,allowedPages);

    res.json(allowedPages);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/logout', (req, res) => {
  console.log('Before Logout - userId:', 'sessionID:', req.sessionID,req.session);
  
  res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'strict' });
  
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.send('Error occurred during logout');
    }
    
    console.log('After Logout - userId:', 'sessionID:', req.sessionID,req.session);
    
    res.redirect('/');
  });
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

