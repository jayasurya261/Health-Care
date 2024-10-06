import express, { request, response } from 'express';
import {PORT,mongoDBURL} from './config.js'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())