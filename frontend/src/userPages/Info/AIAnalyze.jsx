import React, { useState } from 'react';
import axios from 'axios';
import SideBar from '../../components/SideBar';
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const apiKey = "AIzaSyDnwsRRxsn_WkW5vIEqO3_Jq6C0ZaEftHA"; // Insert your API key directly or load securely from backend
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    
    // Log the complete response for debugging
    console.log('Complete Response:', result);

    const outputText = await result.response.text();
    console.log('Output Text:', outputText);
    return outputText;

  } catch (error) {
    console.error('Error in running the AI model:', error);
    return ''; // Return an empty string in case of error
  }
}

function TypingEffect({ text, onComplete }) {
  const [displayText, setDisplayText] = useState('');

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        onComplete(); // Call the onComplete function when typing is finished
      }
    }, 10); // Adjust speed here (10ms per character)

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayText}</span>;
}

function ProcessImagesButton() {
  const email = localStorage.getItem('email');
  const [aiOutput, setAiOutput] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to show spinner
  const [isAnimating, setIsAnimating] = useState(false); // State to control button animation

  const handleProcessImages = async () => {
    setLoading(true); // Start loading
    setIsAnimating(true); // Start button animation
    try {
      const response = await axios.get(`http://localhost:3000/user/analyze-images/${email}`); // Express backend endpoint
      const extractedText = response.data.texts; // Get extracted text
      console.log(`Extracted Text: ${extractedText}`);
      setExtractedText(extractedText); // Set extracted text in state

      // Call the AI function with the extracted text
      const aiOutput = await run('This is my report give a feedback about the health I have by this report what can I do to make my health better ' + extractedText);
      console.log("AI Output:", aiOutput);
      setAiOutput(aiOutput); // Set AI output in state
      formatAiOutput(aiOutput); // Format AI output

    } catch (error) {
      console.error('Error processing images', error);
    } finally {
      setLoading(false); // Stop loading when process completes
      setIsAnimating(false); // Stop button animation
    }
  };

  // Function to format AI output based on symbols
  const formatAiOutput = (output) => {
    // Replace '**' with <b> for bold text
    const boldedOutput = output.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Replace '*' with <br/> for new lines
    const formattedOutput = boldedOutput.replace(/\*/g, '<br/>');

    // Set the formatted output in state
    setFormattedOutput(formattedOutput);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SideBar component */}
      <SideBar />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center w-full p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 animate-fadeIn">Upload & Process Medical Records</h1>
        
        <button
          onClick={handleProcessImages}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform ${isAnimating ? 'animate-pulse' : ''}`}
        >
          {loading ? 'Processing...' : 'Process Images'}
        </button>

        <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">AI Output</h2>

          {/* Show spinner when loading */}
          {loading ? (
            <div className="relative w-11 h-11 spinner ml-[300px]">
              <div className="absolute w-full h-full bg-blue-500/20 border-2 border-blue-500"></div>
              <div className="absolute w-full h-full bg-blue-500/20 border-2 border-blue-500"></div>
              <div className="absolute w-full h-full bg-blue-500/20 border-2 border-blue-500"></div>
              <div className="absolute w-full h-full bg-blue-500/20 border-2 border-blue-500"></div>
              <div className="absolute w-full h-full bg-blue-500/20 border-2 border-blue-500"></div>
              <div className="absolute w-full h-full bg-blue-500/20 border-2 border-blue-500"></div>
            </div>
          ) : (
            <p className="mt-2">
              {aiOutput && <TypingEffect text={aiOutput} onComplete={() => formatAiOutput(aiOutput)} />}
            </p>
          )}

          {/* Display formatted output */}
         
        </div>
      </div>
    </div>
  );
}

export default ProcessImagesButton;
