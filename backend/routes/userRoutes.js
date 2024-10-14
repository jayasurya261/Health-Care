import express from 'express';
import { UserInfo,Image } from '../models/models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


dotenv.config();

const router = express.Router();
const hcaptchaSecret = 'ES_20c2f6dda3ab45bb82a89ee1b09665e1';
const JWT_SECRET = process.env.JWT_SECRET;

// --------Route for Register the user---------
router.post('/register', async (req, res) => {
    const { name, email, password, hcaptchaToken } = req.body;

    if (!hcaptchaToken) {
        return res.status(400).json({ message: 'hCaptcha token is required' });
    }

    try {
        // Verify hCaptcha token
        const verificationURL = `https://hcaptcha.com/siteverify?secret=${hcaptchaSecret}&response=${hcaptchaToken}`;
        const captchaResponse = await fetch(verificationURL, { method: 'POST' });
        const captchaData = await captchaResponse.json();

        if (!captchaData.success) {
            return res.status(400).json({ message: 'hCaptcha verification failed' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserInfo({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

//----------JWT Token Authentication-------------
router.post('/login', async (req, res) => {
    const { email, password, captchaToken } = req.body;

    try {
        const verificationURL = `https://hcaptcha.com/siteverify?secret=${hcaptchaSecret}&response=${captchaToken}`;
        const captchaResponse = await fetch(verificationURL, { method: 'POST' });
        const captchaData = await captchaResponse.json();

        if (!captchaData.success) {
            return res.status(400).json({ message: 'Captcha verification failed' });
        }

        const user = await UserInfo.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

//-------Test JWT Token ---------------
export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: { id: req.user.id, email: req.user.email, name: req.user.name } });
});

// -------Route for Captcha Verification -------
// (This part is left as is.)

// --------GPS Tracking Route----------
router.post('/api/location', async (req, res) => {
    const { latitude, longitude,email } = req.body;
    //  const userId = req.user.id;

    try {
        // Log received location
        console.log(`Received location: Latitude ${latitude}, Longitude ${longitude} for user ${email}`);

        // You can add functionality to store the GPS coordinates in the database, e.g.,:
        const user = await UserInfo.findOne({email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.location = { latitude, longitude }; // You might want to modify your schema to include a location field
        await user.save();

        res.status(200).json({ message: 'Location saved successfully' });
    } catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ message: 'Error saving location', error: error.message });
    }
});

router.post('/app/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await UserInfo.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

        // Return the JWT token
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// GET route to fetch location by userId
router.get('/api/location/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch user from the database
        const user = await UserInfo.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the stored location data back to the client
        const { latitude, longitude } = user.location || {};
        if (!latitude || !longitude) {
            return res.status(404).json({ message: 'Location data not found for user' });
        }

        res.status(200).json({ latitude, longitude });
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ message: 'Error fetching location', error: error.message });
    }
});


router.get('/api/users', async (req, res) => {
    try {
      const users = await UserInfo.find({}, 'name email location'); // Fetch users with specific fields
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  });



  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save images to "uploads" directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});



const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Allow only image files
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only images are allowed');
        }
    },
});

// POST route to upload an image using router
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Save the image metadata in the Image model
        const newImage = new Image({
            filename: req.file.filename,
            filepath: req.file.path,
            contentType: req.file.mimetype,
        });

        const savedImage = await newImage.save();

        // Update the user with the image ID reference
        const userId = req.body.userId;
        const user = await UserInfo.findById('670276fdf5476628071e195a');

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.imageFileIds.push(savedImage._id);
        await user.save();

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageId: savedImage._id,
        });
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err)
    }
});

router.get('/profile/:email', async (request, response) => {
    try {
      const { email } = request.params; // Extracting email from params
      const userData = await UserInfo.findOne({ email });
  
      if (!userData) {
        return response.status(404).json({ message: 'User not found' }); // Handling case when user is not found
      }
  
      return response.status(200).json(userData); // Sending user data directly
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message }); // Sending error message
    }
  });

  router.put('/profile/:email', async (req, res) => {
    const { email } = req.params;
    const {  mobile, location, language, blood } = req.body;
  
    try {
      // Find user by email and update the profile
      const updatedUser = await UserInfo.findOneAndUpdate(
        { email },
        { mobile, location, language, blood },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  });
  
  
export default router;
