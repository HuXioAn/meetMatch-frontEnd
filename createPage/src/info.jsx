// Info.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './info.css';

const Info = () => {
  const location = useLocation();
  const { meetingInfo } = location.state || {};
  const meetingLink = `https://meetmatch.us/table/?vToken=${meetingInfo?.response.tableVisitToken || ''}`;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(meetingLink)
      .then(() => {
        alert('Meeting link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="info-container">
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
      <button onClick={copyLinkToClipboard} className="copy-link-button">
        Copy Meeting Link
      </button>
    </div>
  );
};


export default Info;
