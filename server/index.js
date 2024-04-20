const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
//require('dotenv').config();
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = 3452;

// CORS options
const corsOptions = {
  origin: 'https://webprojmainclient.vercel.app', // The origin of the frontend application
  credentials: true, // Allows cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"]
};
webprojmainserver
app.use(cookieParser());

// Apply CORS before other routes
app.use(cors(corsOptions));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
const  MONGODB_URI="mongodb+srv://omri:webproject@cluster0.mlpcjwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Prefix all bookRoutes and authRoutes with '/api'
app.use('/api', bookRoutes);
app.use('/api', authRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
