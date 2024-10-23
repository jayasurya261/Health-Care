import mongoose from "mongoose";
const adminSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type : String,
            required:true,
            unique : true,
        },
        password : {
            type : String,
            required : true,
        },
        type:{
            type : String,
            required : true,
        }

    },
    {
        timestamps: true,
    }
)

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile:{
            type:Number,
            required:false,
            unique:true,
        },
        place:{
            type:String,
            required:false,
        },
        blood:{
            type:String,
            required:false,
        },
        language:{
            type:String,
            required:false,
        },
        imageFileIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Image',
                required: false,
            },
        ],
        // Add location field to store latitude and longitude
        location: {
            latitude: {
                type: Number,
                required: false, // Make it optional until location is provided
            },
            longitude: {
                type: Number,
                required: false,
            },
        },
    },
    {
        timestamps: true, // This will automatically add createdAt and updatedAt timestamps
    }
);

const imageSchema = mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        },
        filepath: {
            type: String,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        },
        email:{
            type:String,
            required:true,
        }
    },
    {
        timestamps: true,
    }
);

const illnessSchema = mongoose.Schema(
    {
        email :{
            type:String,
            required : true,
        },
        symptoms:{
            type:String,
            required : true,
        },
        isolated:{
            type:Boolean,
            required : false,
        },
        illness : {
            type : String,
            required : false,
        },
        isolationenddate:{
            type:Date,
            required:false
        },
    },
    {
        timestamps:true
    }
   
)

const appointmentSchema = new mongoose.Schema({
    doctorId: {
      type: String, // Could be an ObjectId referencing a Doctor collection, if you have one
      required: true
    },
    date: {
      type: Date, // Stores the date and time of the appointment
      required: true,
      unique : true,
    },
    duration: {
      type: Number, // Duration of the appointment
      required: true,
      default: 15 // Default duration is set to 15 minutes
    },
    email: {
      type: String, // Could store the ID of the patient booking the appointment
      required: true
    },
    description : {
        type:String,
        required : false
    },
    videolink:{
        type:String,
        required : false
    }
  });
 
 export  const VideoAppointment = mongoose.model('VideoAppointment', appointmentSchema);
export const Image = mongoose.model('Image', imageSchema);

export const UserInfo = mongoose.model('UserInfo', userSchema);
export const AdminInfo = mongoose.model('AdminInfo', adminSchema);
export const IllnessInfo = mongoose.model('IllnessInfo', illnessSchema);
