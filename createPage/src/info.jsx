import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './info.css'; // 确保已经更新了CSS文件名和路径

const Info = () => {
  const location = useLocation();
  const { meetingInfo } = location.state || {};
  const meetingLink = `https://meetmatch.us/table/?vToken=${meetingInfo?.response?.tableVisitToken || ''}`;
  const manageLink = `https://meetmatch.us/manage/?mToken=${meetingInfo?.response?.tableManageToken || ''}`; 
  const [guideVisible, setGuideVisible] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const guideSteps = [
    "Use the 'Copy Meeting Link' to share your meeting with others.",
    "Click 'Go to Meeting' to start or join your meeting directly.",
    "Click 'Manage Meeting' to Modify your meeting information."
  ];

  const nextGuideStep = () => {
    if (guideStep < guideSteps.length - 1) {
      setGuideStep(guideStep + 1);
    } else {
      setGuideVisible(false);
      setGuideStep(0);
    }
  };

  return (
    <div className="meeting-centeredContainer">
      <div className="meeting-formContainer">
        <button onClick={() => setGuideVisible(true)} className="meeting-guideButton">?</button>
        {guideVisible && (
          <div className="meeting-guideOverlay">
            <div className="meeting-guideContent">
              <p>{guideSteps[guideStep]}</p>
              <button onClick={nextGuideStep} className="meeting-button">{guideStep < guideSteps.length - 1 ? "Next" : "Close"}</button>
            </div>
          </div>
        )}
        <h2 className="info-title">Meeting Information</h2>
        <div className="info-content">
          <p><strong>Meeting Name:</strong> {meetingInfo?.meetingName}</p>
          <p><strong>Selected Dates:</strong> {meetingInfo?.selectedDates?.join(', ')}</p>
          <p><strong>Max Collaborators:</strong> {meetingInfo?.maxCollaborator}</p>
          <p><strong>Email:</strong> {meetingInfo?.email}</p>
        </div>
        <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-button meeting-goLink">Go to Meeting</a>
        <button onClick={() => navigator.clipboard.writeText(meetingLink)} className="meeting-button meeting-copyLinkButton">Copy Meeting Link</button>
        <a href={manageLink} target="_blank" rel="noopener noreferrer" className="meeting-button meeting-manageLink">Manage Meeting</a>
      </div>
    </div>
  );
};

export default Info;
