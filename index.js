const express = require ('express');
const  dotenv= require ('dotenv') 
const mongoose = require ('mongoose');
const  bodyParser = require ('body-parser');
const cors = require ('cors');
const bcrypt = require ('bcryptjs');
const { ObjectId } = require('mongodb');
const  nanoid  = require('nanoid'); 
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const collegeRoutes =require('./routes/college');
const CurriculumRoutes =require('./routes/curriculum');
const authRoutes = require('./routes/auth');
// const permisionRoutes = require('./routes/permissions');
const reportRoutes = require('./routes/reportSession')
const mouRoutes = require('./routes/mou'); 
const userRoutes = require('./routes/user');

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
app.use(cors()); //mongodb+srv://captadb:captadb@cluster0.9fiyo2y.mongodb.net/?retryWrites=true&w=majority
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


app.get('/',(req,res)=>{
    res.send({Message:"Server is Live :: "});
})

app.use('/auth', authRoutes);
// app.use('/permision', permisionRoutes);
app.use('/mou', mouRoutes);
app.use('/user', userRoutes);
app.use('/college', collegeRoutes);
app.use('/curriculum', CurriculumRoutes);
app.use('/report',reportRoutes);


  app.post('/session/attendance', (req, res) => {
    // Print the received data to the console
    console.log('Received data:', req.body);
  
    // Send a response to the client
    res.json({ message: 'Data received successfully' });
  });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
