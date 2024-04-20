const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => { // Ensure endpoint is lowercase to match the client-side
    try {
        const { username, password, email } = req.body;
  
        // Hash the password 
        //const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user with the hashed password
        const user = new User({ 
            username, 
            password: password, // Use the hashed password here
            email 
        });
  
        // Save the new user
        await user.save();
  
        // Respond with success
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) { // This is the code for a duplicate key error in MongoDB
            res.status(409).json({ message: 'Username or email already exists' }); // Customize the error message as needed
        } else {
            res.status(500).json({ message: 'Error registering new user', error: error.message });
        }
    }
}); 

// Login route
router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        
        // Find the user by username and ensure to populate necessary data if needed
        const user = await User.findOne({ username }).populate('favoriteBooks');
        
        if (!user) {
            // User not found
            return res.status(401).json({ message: "User does not exist" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = (password === user.password);
        if (!isMatch) {
            // Passwords do not match
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Prepare user data to send back
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            favoriteBooks: user.favoriteBooks.map(book => ({
                id: book.id,
                title: book.title,
                author: book.author,
                coverImageUrl: book.coverImageUrl,
                subject: book.subject
            })),
            favoriteSubjects: user.favoriteSubjects  // Ensure the user model supports this attribute
        };

         // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  
        );
        
        // Send the JWT in a cookie with appropriate security settings
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production environment only
            maxAge: 3600000,  // 1 hour
            sameSite: 'None'  // Strict sameSite policy to prevent CSRF
        });

        res.json({ message: "Login successful", user: userData });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
         path: '/', 
         httpOnly: true, 
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'None'
    });
    res.json({ message: 'Logout successful' });
});

router.get('/verify', async (req, res) => {
    try {
        const token = req.cookies.token;
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json("Invalid token or token expired");
            }
            // If token is verified, find the user in the database
            const user = await User.findById(decodedToken.id)
                .select('-password') // Exclude password
                .populate('favoriteBooks') // Populate favorite books if they are references to another collection
                .exec(); // Execute the query

            if (!user) {
                return res.status(401).json({ Reason: "No user found in DB", isLoggedIn: false, user: null });
            }

            // Respond with the user's information if everything is valid
            res.json({ 
                isLoggedIn: true, 
                user: { 
                    username: user.username, 
                    email: user.email, 
                    _id: user._id,
                    favoriteSubjects: user.favoriteSubjects, 
                    favoriteBooks: user.favoriteBooks, 
                } 
            });        
        });
    } catch (error) {
        res.status(500).json({ isLoggedIn: false, user: null, message: 'Internal server error.' });
    }
});

// Middleware to validate the token from cookies
function validateToken(req, res, next) {
    const token = req.cookies['token'];
    if (!token) {
        console.error("No token provided");
        return res.status(401).json({ message: "Authorization denied, no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (e) {
        console.error("Token validation failed:", e);
        res.status(401).json({ message: "Token is not valid" });
    }
}

// Update the favorite subjects of the user
router.put('/update-favorite-subjects', validateToken, async (req, res) => {
    const { subjects } = req.body;
    const userId = req.userId; // Get the user ID from the request after token validation
    console.log(subjects);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favoriteSubjects = subjects;
        await user.save();

        res.json({
            message: 'Favorite subjects updated successfully',
            favoriteSubjects: user.favoriteSubjects
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});


router.put('/update-favorite-books', validateToken, async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const { userId, bookId } = req.body;

        console.log('Parsed userId and bookId:', userId, bookId);

        // Perform the update operation
        const result = await User.updateOne(
            { _id: userId },
            { $addToSet: { favoriteBooks: bookId } }
        );

        console.log('Update result:', result);

        // Check if the operation was successful
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: 'Book was already in favorites' });
        }

        // If successful, return a success message
        res.json({ message: 'Book added to favorites successfully' });
    } catch (error) {
        console.error('Error updating favorite books:', error);
        res.status(500).json({ message: 'Error updating favorite books', error: error.toString() });
    }
});

// Remove book from favorites list
router.delete('/remove-favorite-book/:bookId', validateToken, async (req, res) => {
    const { userId } = req.body;
    const { bookId } = req.params;
    try {
      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.favoriteBooks = user.favoriteBooks.filter(book => book.toString() !== bookId);
      console.log(user.favoriteBooks);
      await user.save();
      res.send({message: "Book removed from favorites" ,favoriteBooks: user.favoriteBooks}).status(200).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove book from favorites", error: error.toString() });
    }
  });

module.exports = router;
