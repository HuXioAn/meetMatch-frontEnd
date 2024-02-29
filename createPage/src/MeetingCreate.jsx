import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import { useHistory } from 'react-router-dom';
import * as api from './api/callapi';
import './MeetingCreate.css';
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

function MeetingCreate() {
    const history = useHistory();
    const [meetingName, setMeetingName] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [maxCollaborator, setMaxCollaborator] = useState('');
    const [email, setEmail] = useState('');
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [guideStep, setGuideStep] = useState(0);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const matcher = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = ({ matches }) => { /* 处理暗模式 */ };
        matcher.addListener(onChange);
        return () => matcher.removeListener(onChange);
    }, []);

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!meetingName.trim()) {
            showAlert("Please fill in the meeting name.");
            return;
        }

        if (selectedDates.length === 0) {
            showAlert("Please select at least one date for the meeting.");
            return;
        }

        const maxCollaboratorsInt = parseInt(maxCollaborator, 10);
        if (!maxCollaborator || isNaN(maxCollaboratorsInt) || maxCollaboratorsInt <= 1) {
            showAlert("Please enter a right maximum number of collaborators.");
            return;
        }

        const dateSelection = selectedDates.map(date => date.format('YYYY-MM-DD'));
        
        api.createTableApi(meetingName, dateSelection, 0, 24, maxCollaborator, email)
            .then(response => {
                history.push('/info', { meetingInfo: { meetingName, selectedDates: dateSelection, maxCollaborator, email, response } });
            })
            .catch(error => {
                console.error('Error creating meeting:', error);
                showAlert('Failed to create meeting.');
            });
    };

    return (
      <div className="centeredContainer">
        <div className="formContainer">
          
       
          {isAlertVisible && (
            <div className="guideOverlay">
              <div className="guideContent">
                <p>{alertMessage}</p>
                <button onClick={() => setIsAlertVisible(false)} className="button">OK</button>
              </div>
            </div>
          )}
          <h2>Create a New Meeting</h2>
          <div className="calendarWrapper">
            <Calendar multiple value={selectedDates} onChange={setSelectedDates} />
          </div>
          <input type="text" value={meetingName} onChange={e => setMeetingName(e.target.value)} placeholder="Meeting Name" className="input" />
          <input type="number" value={maxCollaborator} onChange={e => setMaxCollaborator(e.target.value)} placeholder="Max Collaborators" className="input" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Optional)" className="input" />
          <button onClick={handleSubmit} className="button">Create Meeting</button>
        </div>
      </div>
    );
}

export default MeetingCreate;
