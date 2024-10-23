import Tesseract from 'tesseract.js';

export function analyze(imageFiles, folderName) {
    // Prepend the folder name to each image file path
    const imagePaths = imageFiles.map(file => `../${folderName}/${file}`);

    const promises = imagePaths.map((path) => {
        return Tesseract.recognize(path, 'eng')
            .then(({ data: { text } }) => text); // Return recognized text
    });

    // Use Promise.all to wait for all promises to resolve
    Promise.all(promises)
        .then((texts) => {
            const mergedText = texts.join('\n'); // Merge all recognized texts
            console.log(mergedText); // Output the merged text
        })
        .catch((error) => {
            console.error('Error during OCR processing:', error);
        });
}

// Example usage
const imageFiles = ['r.png', 's.png']; // Array of image filenames
const folderName = 'uploads'; // Default folder name
analyze(imageFiles, folderName);
