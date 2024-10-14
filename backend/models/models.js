import mongoose from "mongoose";

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
        location:{
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
    },
    {
        timestamps: true,
    }
);

export const Image = mongoose.model('Image', imageSchema);

export const UserInfo = mongoose.model('UserInfo', userSchema);
