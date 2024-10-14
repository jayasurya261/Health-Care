import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ userId }) => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image to upload');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('userId', userId); // Send the user ID

        try {
            setUploading(true);
            const response = await axios.post('http://localhost:3000/user/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Image uploaded successfully!');
            setError('');
            setImage(null);
        } catch (err) {
            setError('Failed to upload image');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>Upload an Image</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default ImageUpload;
