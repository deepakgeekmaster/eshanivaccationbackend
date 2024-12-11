const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const path = require('path');
const session = require('express-session');
const propertyRoutes = require('./routes/propertyRoutes');
const authroute = require('./routes/AuthRoute');
const checkoutRoutes  = require('./routes/checkoutRoutes');

const passport = require('passport');


// Initialize dotenv for environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware to parse incoming JSON and form-data
app.use(express.json());
app.use(session({
  secret: "test",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,    // Allow requests only from this origin
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use the property routes
app.use('/api', propertyRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authroute);
app.use("/book", checkoutRoutes);


// Set up a basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// Server listening
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
