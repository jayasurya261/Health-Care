import express from 'express';
import { UserInfo,Image,IllnessInfo,VideoAppointment } from '../models/models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Tesseract from 'tesseract.js';



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
       
        const user = await UserInfo.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const verificationURL = `https://hcaptcha.com/siteverify?secret=${hcaptchaSecret}&response=${captchaToken}`;
        const captchaResponse = await fetch(verificationURL, { method: 'POST' });
        const captchaData = await captchaResponse.json();

        if (!captchaData.success) {
            return res.status(400).json({ message: 'Captcha verification failed' });
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
router.post('/api/location',  authenticateToken,async (req, res) => {
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

router.post('/app/login',  authenticateToken,async (req, res) => {
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
router.get('/api/location/:userId', authenticateToken,async (req, res) => {
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


router.get('/api/users',  authenticateToken,async (req, res) => {
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
router.post('/upload/:email', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
          const email = req.params;
        // Save the image metadata in the Image model
        const newImage = new Image({
            filename: req.file.filename,
            filepath: req.file.path,
            contentType: req.file.mimetype,
            email : email.email,
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

router.get('/profile/:email', authenticateToken,async (request, response) => {
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

  router.put('/profile/:email', authenticateToken,async (req, res) => {
    const { email } = req.params;
    const {  mobile, place, language, blood } = req.body;
  
    try {
      // Find user by email and update the profile
      const updatedUser = await UserInfo.findOneAndUpdate(
        { email },
        { mobile, place, language, blood },
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



  router.post('/illness/form', authenticateToken, async(req,res)=>{
    const {email,symptoms,isolated,illness,isolationenddate} = req.body;
    try {
        const newUser = new IllnessInfo({
            email,
            symptoms,
            isolated,
            illness,
            isolationenddate,
        });

        await newUser.save();
        res.status(201).json({ message: 'Request Rised successfully' });
    }catch(error){
        console.log(error)
    }
  })
  
  router.get('/illness/my-requests/:email',  authenticateToken, async(request, response) => {
    const { email } = request.params;
    try {
      const { email } = request.params; // Extracting email from params
      const userData = await IllnessInfo.find({email });
  
      if (!userData) {
        return response.status(404).json({ message: 'User not found' }); // Handling case when user is not found
      }
  
      return response.status(200).json(userData); // Sending user data directly
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message }); // Sending error message
    }
  });
  router.get('/illness/my-requests',  authenticateToken, async(request, response) => {
    const { email } = request.params;
    try {
      const { email } = request.params; // Extracting email from params
      const userData = await IllnessInfo.find();
  
      if (!userData) {
        return response.status(404).json({ message: 'User not found' }); // Handling case when user is not found
      }
  
      return response.status(200).json(userData); // Sending user data directly
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message }); // Sending error message
    }
  });
  router.put('/illness/update-permission/:id',  authenticateToken,async (req, res) => {
    const { id } = req.params; // Extract the request ID from the URL
    const { isolated } = req.body; // Extract the isolated status from the request body
    const userType = req.body.userType; // Get the user type from request body or from token (if needed)
  
    try {
      // Only allow the update if the user is an admin
     
  
      // Find the illness request by ID and update the isolated status
      const updatedRequest = await IllnessInfo.findByIdAndUpdate(
        id,
        { isolated }, // Update only the isolated field
        { new: true } // Return the updated document
      );
  
      if (!updatedRequest) {
        return res.status(404).json({ message: 'Illness request not found' });
      }
  
      return res.status(200).json(updatedRequest); // Return the updated request
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  });
  

  router.get('/illness/request-info/:_id',  authenticateToken,async (request, response) => {
   
    try {
      const { _id } = request.params; // Extracting email from params
      const userData = await IllnessInfo.findById(_id );
  
      if (!userData) {
        return response.status(404).json({ message: 'User not found' }); // Handling case when user is not found
      }
  
      return response.status(200).json(userData); // Sending user data directly
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message }); // Sending error message
    }
  });

  const isSlotAvailable = async (newAppointment) => {
    const conflictingAppointments = await VideoAppointment.find({
      doctorId: newAppointment.doctorId,
      date: new Date(newAppointment.date),
    });
  
    return conflictingAppointments.length === 0;
  };
  
  // GET route to fetch appointments for a specific date and doctor
  router.get('/appointments',  authenticateToken,async (req, res) => {
    try {
      const { doctorId, date } = req.query;
      const requestedDate = new Date(date);
  
      // Fetch appointments for the selected date and doctor
      const filteredAppointments = await VideoAppointment.find({
        doctorId,
        date: {
          $gte: requestedDate.setHours(0, 0, 0, 0),
          $lt: requestedDate.setHours(23, 59, 59, 999),
        },
      });
  
      res.status(200).json(filteredAppointments);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching appointments' });
    }
  });
  
  // POST route to book an appointment
  router.post('/appointments',  authenticateToken,async (req, res) => {
    try {

      const { doctorId, date, duration = 15, email,description, videolink = uuidv4() } = req.body;
  
      const newAppointment = new VideoAppointment({
        doctorId,
        date,
        duration,
        description,
        email,
        videolink,
     // Include the video call link
      });
  
      // Check if the time slot is available
      if (!(await isSlotAvailable(newAppointment))) {
        return res.status(400).json({ message: 'Time slot already booked' });
      }
  
      // Save the new appointment to the database
      await newAppointment.save();
      res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error booking appointment' });
    }
  });

  router.get('/appointments/all/:email',  authenticateToken,async (req, res) => {
    try {
      const email = req.params;
      const appointments = await VideoAppointment.find(email); // Fetch all appointments from the database
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments', error });
    }
  });
  
  router.get('/appointments/all',  authenticateToken,async (req, res) => {
    try {
  
      const appointments = await VideoAppointment.find(); // Fetch all appointments from the database
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments', error });
    }
  });
  
//--------------------------------------//
  router.get('/analyze-images/:email',  authenticateToken,async (req, res) => {
    try {
      const email = req.params;
        // Fetch images from the database
        const images = await Image.find(email);

        // Extract file paths
        const imagePaths = images.map(image => image.filepath);

        // Analyze images with Tesseract
        const recognizedTexts = await analyze(imagePaths);

        // Send recognized texts as response
        res.json({ texts: recognizedTexts });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Error fetching images' });
    }
});

// Function to analyze images using Tesseract
async function analyze(imagePaths) {
    const promises = imagePaths.map((path) => {
        return Tesseract.recognize(path, 'eng')
            .then(({ data: { text } }) => text); // Return recognized text
    });

    // Wait for all promises to resolve
    const texts = await Promise.all(promises);
    return texts.join('\n'); // Merge all recognized texts
}


//-------------------------------------
const TWILIO_ACCOUNT_SID = 'ACfe06c50596d14e7ad2f2d10c10331682';
const TWILIO_AUTH_TOKEN = 'e7c9d044014b1bdb2053a60068b4b96a';
const TWILIO_PHONE_NUMBER = '+18582814480';
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


import twilio from 'twilio';
router.post('/make-call', (req, res) => {
  const toNumber = req.body.to_number;
  const locationMessage = req.body.location_message; // Get location message from request
  console.log(`Request to make a call to: ${toNumber}`);

  if (!toNumber || !locationMessage) {
    return res.status(400).json({ error: 'Missing to_number or location_message in request body' });
  }

  // TwiML response with dynamic location
  const twimlMessage = `<Response><Say>This is an alert. Can you help me please? ${locationMessage}</Say></Response>`;

  client.calls
    .create({
      to: toNumber,
      from: TWILIO_PHONE_NUMBER,
      twiml: twimlMessage,
    })
    .then((call) => {
      console.log(`Call initiated: ${call.sid}`);
      res.json({ status: 'Call initiated', call_sid: call.sid });
    })
    .catch((error) => {
      console.error('Error making call:', error.message);
      res.status(500).json({ error: 'Failed to make call', message: error.message });
    });
});

export default router;
