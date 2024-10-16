import express from 'express';
import { UserInfo,Image,AdminInfo } from '../models/models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();


router.post('/admin-register', async (req, res) => {
    const { name, email, password,type } = req.body;

    try {
        // Hash the password
      

        // Create and save the new user
        const newUser = new AdminInfo({
            name,
            email,
            password,
            type,
        });

        await newUser.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

router.post('/admin-login', async (req, res) => {
    const { email, password } = req.body; // Get email and password from query parameters

    try {
        // Find the admin by email
        const admin = await AdminInfo.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        // Check if the password is correct
      
        // Success
        res.status(200).json({ message: 'Login successful', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});


export default router;