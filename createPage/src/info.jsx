import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';


const Info = () => {
  const location = useLocation();
  const { meetingInfo } = location.state || {};
  const meetingLink = `https://meetmatch.us/table/?vToken=${meetingInfo?.response.tableVisitToken || ''}`;

  // 导览状态
  const [guideVisible, setGuideVisible] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  // 导览内容
  const guideSteps = [
    "Welcome to your meeting dashboard. Here you can find all the details about your meeting.",
    "Use the 'Copy Meeting Link' to share your meeting with others.",
    "Click 'Go to Meeting' to start or join your meeting directly."
  ];

  // 显示下一步导览或结束导览
  const nextGuideStep = () => {
    if (guideStep < guideSteps.length - 1) {
      setGuideStep(guideStep + 1);
    } else {
      setGuideVisible(false);
      setGuideStep(0); // 重置导览步骤
    }
  };

  return (
    <div className="info-container">
      <button onClick={() => setGuideVisible(true)} className="guide-button">!</button>
      {guideVisible && (
        <div className="guide-overlay">
          <div className="guide-content">
            <p>{guideSteps[guideStep]}</p>
            <button onClick={nextGuideStep} className="guide-next">➡️</button>
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
      <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="go-link">
        Go to Meeting
      </a>
      <button onClick={() => navigator.clipboard.writeText(meetingLink)} className="copy-link-button">
        Copy Meeting Link
      </button>
    </div>
  );
};

export default Info;
