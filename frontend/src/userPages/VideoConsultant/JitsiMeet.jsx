import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const JitsiMeet = () => {
  const { videolink } = useParams();
  const roomName = videolink || "VideoConsultant";

  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      const domain = "meet.jit.si";
      const options = {
        roomName: roomName,
        width: "100%",
        height: "100%",
        parentNode: document.getElementById('jitsi-container'),
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'chat', 'raisehand', 'tileview', 'hangup'
          ],
        },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          prejoinPageEnabled: false,  // Skip prejoin page to avoid login prompts
          requireDisplayName: false,  // Avoid requiring a display name
          enableLobby: false,         // Disable lobby to prevent moderator prompts
        },
        userInfo: {
          displayName: "Patient",
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener('participantJoined', (event) => {
        console.log('Participant joined:', event);
      });

      api.addEventListener('videoConferenceLeft', () => {
        console.log('Conference ended');
      });

      return () => {
        api.dispose();
      };
    } else {
      console.error('Jitsi Meet API script not loaded');
    }
  }, [roomName]);

  return (
    <div>
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">Welcome to Your Video Consultation</h1>
        <p>The session will start shortly. Please wait for the doctor to join.</p>
      </div>
      <div id="jitsi-container" style={{ height: "600px", width: "100%" }}>
        {/* Jitsi iframe will be inserted here */}
      </div>
    </div>
  );
};

export default JitsiMeet;
