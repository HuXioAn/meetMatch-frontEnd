
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-multi-date-picker';
import { useHistory } from 'react-router-dom';
import * as api from './api/callapi';
import './MeetingManage.css';

function MeetingManage() {
    const history = useHistory();
    const initialDates = ["2024-03-01", "2024-03-02", "2024-03-04"].map(date => new Date(date));

    const [meetingName, setMeetingName] = useState('Initial Meeting Name');
    const [selectedDates, setSelectedDates] = useState(initialDates);
    const [maxCollaborator, setMaxCollaborator] = useState(10);
    const [email, setEmail] = useState('example@example.com');
    const [mToken, setMToken] = useState('fakeMToken123456');

    const handleUpdate = async (event) => {
      event.preventDefault();
      const dateSelection = selectedDates.map(date => date.toISOString().split('T')[0]);
  
      api.manageTableApi(mToken, meetingName, dateSelection, 0, 24, maxCollaborator, email)
          .then(response => {
                  history.push('/info', { meetingInfo: { meetingName, selectedDates: dateSelection, maxCollaborator, email, response } });
              } )
              
          .catch(error => {
              console.error('Error updating meeting:', error);
              alert('Failed to update meeting.');
          });
  };
  

  const handleDelete = async (event) => {
    event.preventDefault();

    api.deleteTableApi(mToken)
        .then(response => {
                alert('Meeting deleted successfully.');
                history.push('/'); // keyi back to home
            })
        
        .catch(error => {
            console.error('Error deleting meeting:', error);
            alert('Failed to delete meeting.');
        });
};


    return (
        <div className="centeredContainer">
            <div className="formContainer">
                <h2>Manage Meeting</h2>
                <div className="calendarWrapper">
                    <Calendar multiple value={selectedDates} onChange={setSelectedDates} />
                </div>
                <input type="text" value={meetingName} onChange={e => setMeetingName(e.target.value)} placeholder="Meeting Name" className="input" />
                <input type="number" value={maxCollaborator} onChange={e => setMaxCollaborator(e.target.value)} placeholder="Max Collaborators" className="input" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Optional)" className="input" />
                <div className="buttonContainer">
                    <button onClick={handleUpdate} className="button">Submit</button>
                    <button onClick={handleDelete} className="button">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default MeetingManage;
